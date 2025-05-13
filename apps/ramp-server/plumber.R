library(plumber)
library(metLinkR)
library(sqldf)
library(config)
library(R.cache)
library(readr)
library(ggplot2)
library(svglite)

###########
########### Utils
###########

require(parallel)
available_cores <- parallel::detectCores()
## For maximum speed, we reserve all cores minus one, so the machine can still perform some background tasks
n_cores <- available_cores - 1


rampDB <<- RaMP:::RaMP(branch='ramp3.0') # pre-load sqlite database to the container

#* @apiTitle RaMP_API
#* @apiDescription REST API for the Relational Database of Metabolomics Pathways (RaMP) Application
#* @apiVersion 1.0.1

serializers <- list(
  "json" = serializer_json(),
  "tsv" = serializer_tsv()
)

makeFunctionCall<-function(input, functionName){
    input <- paste(input, collapse = '", "')
    input <- paste0('c("',input,'")')
    #string <- paste0("RaMP::",functionName,"(",input,")")
    string <- paste0("RaMP::",functionName,"(INPUT)")
   # string <- gsub('(.{1,130})(\\s|$)', '\\1\n', string)
    return(string)
}

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods", "*")
    res$setHeader(
      "Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS
    )
    res$status <- 200
    return(list())
  } else {
    plumber::forward()
  }
}

###########
########### RaMP info endpoints
###########


######
#' Return source version information. Includes RaMP version number, source database versions, and other metadata
#' @serializer unboxedJSON
#' @get /api/source-versions
function() {
  version_info <- RaMP::getCurrentRaMPSourceDBVersions(db = rampDB)

  return(list(
    data = version_info,
    function_call="RaMP::getCurrentRaMPSourceDBVersions()"
  ))
}

######
#' Return RaMP database version number
#' @serializer unboxedJSON
#' @get /api/ramp-db-version
function() {
  version <- RaMP::getCurrentRaMPVersion(db = rampDB)

  return(list(
    data = version,
    function_call="RaMP::getCurrentRaMPVersion()"
  ))
}

######
#' Return RaMP database version number along with current version notes
#' @get /api/current-db-file-url
function() {
  versionInfo <- RaMP::getCurrentRaMPVersion(db = rampDB, justVersion = FALSE)
  dbURL <- unlist(versionInfo$db_sql_url)
  return(list(
    data = dbURL,
    function_call="RaMP::getCurrentRaMPVersion(justVersion = FALSE)"
  ))
}



####
#' Return valid RaMP-DB database prefixes for genes and metabolites (e.g. 'hmdb:', 'kegg:')
#' @serializer unboxedJSON
#' @get /api/id-types
function() {
  met <- RaMP::getPrefixesFromAnalytes(db = rampDB, "metabolite")
  gene <- RaMP::getPrefixesFromAnalytes(db = rampDB, "gene")

  return(list(
    data = rbind(met,gene),
    function_call='RaMP::getPrefixesFromAnalytes("metabolite"); RaMP::getPrefixesFromAnalytes("gene")'
  ))
}

####
#' Return association counts for different RaMP-DB data types, broken down by source database (chemical properties, pathway associations, gene/metabolite/pathway counts)
#' @serializer unboxedJSON
#' @get /api/entity-counts
function() {
  entity_counts <- RaMP::getEntityCountsFromSourceDBs(db = rampDB)

  return(list(
    data = entity_counts,
    function_call="RaMP::getEntityCountsFromSourceDBs()"
  ))
}

###
#' Return redundancy of source databases. Lists counts of identical analytes pulled from source databases.
#' @param analytetype specifies type of analyte intersects to return, 'metabolites' or 'genes'
#' @param query_scope specifies 'global' or 'mapped-to-pathway'
#' @get /api/analyte-intersects
function(analytetype, query_scope = 'global') {
  response <- ""
  if(!missing(analytetype)) {
    if(analytetype == 'metabolites') {
      response <- RaMP::getRaMPAnalyteIntersections(db = rampDB, analyteType=analytetype, format='json', scope=query_scope)
      function_call <- paste0("RaMP::getRaMPAnalyteIntersections(analyteType='metabolites', format='json', scope='",query_scope,")")
    } else {
      response <- RaMP::getRaMPAnalyteIntersections(db = rampDB, analyteType=analytetype, format='json', scope=query_scope)
      function_call <- paste0("RaMP::getRaMPAnalyteIntersections(analyteType='genes', format='json', scope='",query_scope,")")
    }
    # have to convert from JSON to avoid double serializing JSON
    response <- jsonlite::fromJSON(response)
  }
  return(list(
    data = response,
    function_call= function_call
  ))
}

#####
#' Return all metabolite ontologies present in RaMP-DB, including ontology category (e.g. 'Health condition', 'Biofluid and excreta', etc.)
#' @serializer unboxedJSON
#' @get /api/ontology-types
function() {
  ontologies <- RaMP::getOntologies(db = rampDB)
  ontologies <- list(
    num_ontology_types = length(unique(ontologies$HMDBOntologyType)),
    uniq_ontology_types = unique(ontologies$HMDBOntologyType),
    data = ontologies,
    function_call = "ontologies <- getOntologies()"
  )
  return(ontologies)
}

#####
#' Return chemical class levels present in RaMP-DB (e.g. sub-class, super-class)
#' @get /api/chemical-class-type
function() {
  classtypes <- tryCatch({
    getMetabClassTypes(db = rampDB)
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })
  return(classtypes)
}


###########
########### Biochemical Pathway endpoints
###########


#####
#' Return pathway mappings from given list of analytes
#' @post /api/pathways-from-analytes
#' @param analytes:[string]
function(analytes) {
    pathways_df <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(db = rampDB, analytes = analytes)
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(
        list(
            data = unique(pathways_df),
            function_call = makeFunctionCall(analytes,"getPathwayFromAnalyte"),
            numFoundIds = length(unique(pathways_df$commonName))
        )
    )
}

##########
#' Return analytes from given list of pathways as either json or a tsv
#' @param pathway pathway identifier
#' @param analyteType genes, metabolites, or both
#' @param namesOrIds Pathway common name or database identifier
#' @param match fuzzy or exact match
#' @param maxPathwaySize Upper limit for size of returned pathways
#' @post /api/analytes-from-pathways
function(pathway, analyteType="both", namesOrIds="names", match="fuzzy", maxPathwaySize=1000) {
  analytes_df <- tryCatch({
    RaMP::getAnalyteFromPathway(db = rampDB, pathway = pathway, analyteType=analyteType, match=match, namesOrIds=namesOrIds, maxPathwaySize=maxPathwaySize)
  },
    error = function(cond) {
      print(cond)
      return(data.frame())
    })
  analytes_df[is.na(analytes_df)] <- ""
  return(
      list(
          data = analytes_df,
          function_call = makeFunctionCall(pathway,"getAnalyteFromPathway"),
          numFoundIds = length(unique(analytes_df$pathwayName))
      )
  )
}

###########
########### Biochemical Pathway enrichment endpoints
###########

#####
#' Return combined Fisher's test results
#' from given list of analytes query results
#' @param analytes list of analytes of interest for pathway analysis
#' @param background biospecimen background for Fisher's test
#' @param backgroundFile: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/pathway-enrichment
#' @serializer json list(digits = 6)
function(analytes, background = '', backgroundFile = '', backgroundType= "database") {
  fishers_results_df <- ''
  if(backgroundFile == "") {
    if(background == "") {
      print("run with database background")
      fishers_results_df <- RaMP::runEnrichPathways(
        db = rampDB,
        analytes,
        background = NULL,
        backgroundType= "database"
      )
    } else {
      print("run with biospecimen")
      fishers_results_df <- RaMP::runEnrichPathways(
        db = rampDB,
        analytes = analytes,
        background = background,
        backgroundType= "biospecimen"
      )
    }
  }
  else {
    print("run with background file")
    bg <- gsub("\r\n", ",", backgroundFile)
    file <- unlist(strsplit(bg, ','))
    if(length(file) > length(analytes)) {
      fishers_results_df <- RaMP::runEnrichPathways(
        db = rampDB,
        analytes = analytes,
        background = file,
        backgroundType= "list"
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
    }
  }
  analytes <- paste(analytes, collapse = ", ")
  return(list(
    data = fishers_results_df,
    function_call = paste0("RaMP::runEnrichPathways()")
  ))
}

#####
#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results output of runEnrichPathways
#' @param pValType one of "fdr" or "holm" or "pval"
#' @param pValCutoff p value threshold below which results are considered significant
#' @post /api/filter-enrichment-results
#' @serializer json list(digits = 6)
function(fishers_results,  pValType = 'holm', pValCutoff = 0.1) {
  filtered_results <- RaMP::filterEnrichResults(
    enrichResults = fishers_results,
    pValType = pValType,
    pValCutoff = pValCutoff
  )
  fishers_results <- paste(fishers_results, collapse = ", ")
  return(list(
    data = filtered_results,
    function_call = paste0("RaMP::filterEnrichResults()")
  ))
}

#####
#' from given list of Fisher's test results using the findCluster method from the R package (see documentation for further details)
#' @param fishers_results Output of Fisher's enrichment
#' @param percAnalyteOverlap Minimum overlap for pathways to be considered similar
#' @param percPathwayOverlap Minimum overlap for clusters to merge
#' @param minPathwayToCluster Minimum number of 'similar' pathways required to start a cluster (medoid)
#' @post /api/cluster-enrichment-results
#' @serializer json list(digits = 6)
function(
  fishers_results,
  #analyte_source_id,
  percAnalyteOverlap = 0.5,
  percPathwayOverlap = 0.5,
  minPathwayToCluster = 2
) {
  if (typeof(minPathwayToCluster) == "character") {
    minPathwayToCluster <- strtoi(minPathwayToCluster, base = 0L)
  }
  clustering_results <- RaMP::findCluster(
    db = rampDB,
    fishersDf = fishers_results,
    percAnalyteOverlap = percAnalyteOverlap,
    minPathwayToCluster = minPathwayToCluster,
    percPathwayOverlap = percPathwayOverlap
  )
  return(
    list(
      data = clustering_results,
      function_call = paste0("RaMP::runEnrichChemClass())")
      #numFoundIds = length(unique(chemical_enrichment_df$chem_props$chem_source_id))
    )
  )
}

#####
#' Return lollipop plot for clustered Fisher's test results
#' from given list of Fisher's test results using the findCluster method from the R package (see documentation for further details)
#' @param fishers_results Output of Fisher's enrichment
#' @param percAnalyteOverlap Minimum overlap for pathways to be considered similar
#' @param percPathwayOverlap Minimum overlap for clusters to merge
#' @param minPathwayToCluster Minimum number of 'similar' pathways required to start a cluster (medoid)
#' @param filename
#' @post /api/cluster-plot
#' @serializer contentType list(type='image/svg')
#'
function(
  fishers_results,
  percAnalyteOverlap = 0.5,
  percPathwayOverlap = 0.5,
  minPathwayToCluster=2,
  filename
) {
  if (typeof(minPathwayToCluster) == "character") {
    minPathwayToCluster <- strtoi(minPathwayToCluster, base = 0L)
  }

  clustered_plot <- RaMP::plotPathwayResults(
    db = rampDB,
    pathwaysSig = fishers_results,
    textSize = 8,
    percAnalyteOverlap = percAnalyteOverlap,
    minPathwayToCluster = minPathwayToCluster,
    percPathwayOverlap = percPathwayOverlap,
  )
  file <- ggsave(filename,clustered_plot, width = 10, height = 10)
  r <- readBin(file,'raw',n = file.info(file)$size)
  unlink(filename)
  return(r)
}

###########
########### Ontology endpoints
###########

#####
#' Return ontology mappings from list of metabolites
#' @param metabolites
#' @post /api/ontologies-from-metabolites
function(metabolites) {
    ontologies_df <-
        RaMP::getOntoFromMeta(db = rampDB, mets = metabolites)
    if(is.null(ontologies_df)){
        ontologies_df<-data.frame()
    }
    return(
        list(
            data = ontologies_df,
            function_call = makeFunctionCall(metabolites, "getOntoFromMeta"),
            numFoundIds = length(unique(ontologies_df$sourceId))
        )
    )
}

#' Return metabolites associated with input ontology
#' @param ontology Ontology name to be queried
#' @param format one of "json" or "tsv"
#' @post /api/metabolites-from-ontologies
function(ontology, format = "json", res) {
  print(ontology)
  ontologies_names <- c(ontology)
  ontologies <- RaMP::getMetaFromOnto(db = rampDB, ontology = ontologies_names)
  if (is.null(nrow(ontologies))) {
    return(
      list(
        data = vector(),
        function_call = paste0("RaMP::getMetaFromOnto(ontology = c(",
                               ontologies_names, "))"),
        numFoundIds = length(unique(ontologies))
      )
    )
  }else {
    res$serializer <- serializers[[format]]
    if(format == "tsv") {
      return(as_attachment(ontologies, "getMetaFromOnto.tsv"))
    } else {
      return(
        list(
          data = ontologies,
          function_call = makeFunctionCall(ontology,"getMetaFromOnto"),
          numFoundIds = length(unique(ontologies))
        )
      )
    }
  }
}

#####
#' Perform ontology enrichment on given metabolites
#' @param metabolites Input for ontology enrichment
#' @param background Restrict background to particular biospecimen
#' @param backgroundFile: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/ontology-enrichment
function(metabolites = '', backgroundFile = '', background = '', backgroundType = "database") {
  ontology_enrichment_df <- ''
  if(backgroundFile == "") {
    if(background == "") {
      print("run with database background")
      ontology_enrichment_df <- RaMP::runEnrichOntologies(
        db = rampDB,
        metabolites,
        background = NULL,
        backgroundType= "database"
      )
    } else {
      print("run with biospecimen")
      ontology_enrichment_df <- RaMP::runEnrichOntologies(
        db = rampDB,
        metabolites,
        background = background,
        backgroundType= "biospecimen"
      )
    }
  }
  else {
    print("run with background file")
    bg <- gsub("\r\n", ",", backgroundFile)
    background <- unlist(strsplit(bg, ','))
    if(length(background) > length(metabolites)) {
      ontology_enrichment_df <- RaMP::runEnrichOntologies(
        db = rampDB,
        metabolites,
        background = background,
        backgroundType= "list"
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
    }
  }
  return(
    list(
      data = ontology_enrichment_df,
      function_call = makeFunctionCall(metabolites,"runEnrichOntologies")
    )
  )
}


###########
########### Reaction endpoints
###########


####
#' Return analytes involved in same reaction as given list of analytes from the 'catalyzed' table
#' @param analyte list of analytes to be queried
#' @post /api/common-reaction-analytes
function(analytes, namesOrIds = "ids") {
  analytes_df <-
    tryCatch({
      RaMP::rampFastCata(
        db = rampDB,
        analytes = analytes
      )
      # hmdbMatches <- unlist(unique(analytes_df[[1]]$input_analyte))
      #  rheaMatches <- unlist(unique(analytes_df[[2]]$input_analyte))
      # idMatches = length(union(hmdbMatches, rheaMatches))
      # idMatches = length(analytes_df)

      # this is the return object from the try/catch
      # with ramp v3.0, the result is a dataframe of HMDB results and a second dataframe of Rhea results
      #  list(data=analytes_df, idMatchCount=idMatches)
    },
      error = function(cond) {
        idMatches = 0
        return(data.frame(stringsAsFactors = FALSE))
      })

  # Removing Capacity to search by name for now - EM 12/13/2021
  #    analytes_df_names <- tryCatch({
  #        analytes_df <- RaMP::rampFastCata(
  #            analytes = analytes,
  #            namesOrIds = "names"
  #        )
  #    },
  #        error = function(cond) {
  #            return(data.frame(stringsAsFactors = FALSE))
  #        }
  #    )
  #    analytes_df <- rbind(analytes_df_ids, analytes_df_names)

  return(
    # note... currently we're just returning the HMDB results.
    # RaMP v3 also has Rhea results that can be displayed
    # It would be referenced like this in this method:  analytes_df_ids$data$Rhea_Analyte_Associations
    # note below we only reference the HMDB result until the UI can process both dataframes.
    list(
      data = unique(analytes_df),
      function_call = makeFunctionCall(analytes,"rampFastCata"),
      numFoundIds = length(analytes_df)
    )
  )
}

#' Returns reactions associated with input analytes, metabolites and/or genes/proteins.
#' @param analytes
#' @param onlyHumanMets
#' @param humanProtein
#' @param includeTransportRxns
#' @param rxnDirs
#' @param includeRxnURLs
#' @post /api/reactions-from-analytes
#' @serializer json list(digits = 6)
function(
  analytes,
  onlyHumanMets = FALSE,
  humanProtein = TRUE,
  includeTransportRxns = TRUE,
  rxnDirs = 'UN',
  includeRxnURLs = FALSE
) {
  result = RaMP::getReactionsForAnalytes(
    db=rampDB,
    analytes=analytes,
    onlyHumanMets = onlyHumanMets,
    humanProtein = humanProtein,
    includeTransportRxns = includeTransportRxns,
    rxnDirs = rxnDirs,
    includeRxnURLs = includeRxnURLs
  )

  plot<- RaMP:::buildAnalyteOverlapPerRxnLevelUpsetDataframe(result)
  analyteStr = RaMP:::listToQueryString(analytes)
  rxnDirs = RaMP:::listToQueryString(rxnDirs)

  return(
    list(
      data = result,
      plot = plot,
      # function_call = paste0("RaMP::getReactionsForAnalytes(db=RaMPDB, analytes=c(",analyteStr,"), onlyHumanMets=",onlyHumanMets,", humanProtein=",humanProtein,", includeTransportRxns=",includeTransportRxns,", rxnDirs=c(",rxnDirs,"), includeRxnURLs=",includeRxnURLs,"")
      function_call = makeFunctionCall(analyteStr, "getReactionsForAnalytes")
    )
  )
}

#' getReactionClassesForAnalytes returns reactions class and EC numbers for a collection of input compound ids
#'
#' @param analytes
#' @param multiRxnParticipantCount
#' @param humanProtein
#' @param concatResults
#' @post /api/reaction-classes-from-analytes
#' @serializer json list(digits = 6)
function(
  analytes,
  multiRxnParticipantCount = 1,
  humanProtein = TRUE,
  concatResults = TRUE,
  includeReactionIDs = FALSE,
  useIdMapping = FALSE
) {
  result <- RaMP::getReactionClassesForAnalytes(
    db=rampDB,
    analytes=analytes,
    multiRxnParticipantCount = multiRxnParticipantCount,
    humanProtein=humanProtein,
    concatResults=concatResults,
    includeReactionIDs=includeReactionIDs,
    useIdMapping = useIdMapping
  )

  analyteStr = RaMP:::listToQueryString(analytes)

  return(
    list(
      data = result,
      # function_call = paste0("RaMP::getReactionClassesForAnalytes(db=RaMPDB, analytes=c(",analyteStr,"), multiRxnParticipantCount=",multiRxnParticipantCount,", humanProtein=",humanProtein,", concatResults=",concatResults,")")
      function_call = makeFunctionCall(analytes,"getReactionClassesForAnalyes")
    )
  )
}

#####
#' Perform reaction class enrichment on given analytes
#' @param analytes Input for reaction class enrichment
#' @param background Restrict background to particular biospecimen
#' @param backgroundFile: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/reaction-class-enrichment
function(analytes = '', backgroundFile = '', background = '', backgroundType = "database") {
  reaction_class_enrichment_df <- ''
  if(backgroundFile == "") {
    if(background == "") {
      reaction_class_enrichment_df <- RaMP::runEnrichReactionClass(
        analytes,
        #  background = NULL,
        # backgroundType= "database",
        db = rampDB,
      )
    } else {
      reaction_class_enrichment_df <- RaMP::runEnrichReactionClass(
        analytes,
        # background = background,
        # backgroundType= "biospecimen",
        db = rampDB
      )
    }
  }
  else {
    bg <- gsub("\r\n", ",", backgroundFile)
    background <- unlist(strsplit(bg, ','))
    if(length(background) > length(analytes)) {
      reaction_class_enrichment_df <- RaMP::runEnrichReactionClass(
        analytes,
        # background = background,
        # backgroundType= "list",
        db = rampDB
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
    }
  }
  return(
    list(
      data = reaction_class_enrichment_df,
      function_call = makeFunctionCall(analytes,"runEnrichReactionClass")
    )
  )
}

#' getReactionParticipants returns protein information for a list of reaction ids.
#' This utility method can help extend information from previous queries.
#' For instance, if a user queries for reactions related to a list of metabolites,
#' this method can be used to return proteins on some subset of reaction ids to find related proteins.
#'
#' @param reactionList Rhea reactions ids, such as rhea:38747
#' @post /api/get-reaction-participants
#' @serializer json list(digits = 6)
function(
  reactionList
) {
  result = getReactionParticipants(db=rampDB, reactionList=reactionList)

  rxnStr = RaMP:::listToQueryString(reactionList)

  return(
    list(
      data = result,
      # function_call = paste0("RaMP::getReactionParticipants(db=RaMPDB, reactionList=c(",rxnStr,"))")
      function_call = makeFunctionCall(rxnStr,"getReactionParticipants"),
    )
  )
}

#' getReactionDetails returns general reaction information for a list of reaction ids.
#' This utility methed can help extend information from previous queries.
#' For instance, if a user queries for reactions related to a list of analytes, or filtered on reactions,
#' this method can be used to return general reaction info on some subset of reaction ids of interest.
#'
#' @param reactionList list of reaction ids
#' @post /api/get-reaction-details
#' @serializer json list(digits = 6)
function(
  reactionList
) {
  result = getReactionDetails(db=rampDB, reactionList=reactionList)

  rxnStr = RaMP:::listToQueryString(reactionList)

  return(
    list(
      data = result,
      #  function_call = paste0("RaMP::getReactionDetails(db=RaMPDB, reactionList=c(",rxnStr,"))")
      function_call = makeFunctionCall(rxnStr,"getReactionDetails"),

    )
  )
}

###########
########### Chemical descriptor endpoints
###########


######
#' Return available chemical classes of given metabolites in RaMP-DB
#' @param metabolites Input metabolites
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-classes
function(metabolites="") {
    ## 4/25 - add a trycatch here
    chemical_class_df <- tryCatch({RaMP::getChemClass(
                                             db = rampDB,
                                             metabolites,
                                             background = NULL,
                                             backgroundType= "database"
                                         )},
                                  error = function(cond){
                                      print(cond)
                                      return(data.frame())
                                  })
    return(
        list(
            data = chemical_class_df$met_classes,
            function_call = makeFunctionCall(metabolites,"getChemClass"),
            numFoundIds = length(unique(chemical_class_df$met_classes$sourceId))
        )
    )
}

#####
#' Return chemical properties of given metabolites regarding structure
#' @param metabolites a list object of source prepended metabolite ids, representing a metabolite set of interest
#' @param property an optional list of specific properties to extract. Options include 'all' (default), 'smiles',
#' 'inchi_key', 'inchi_key_prefix', 'inchi', 'mw', 'monoisotop_mass', 'formula', 'common_name'. If a props list is not
#' supplied, all property fields will be returned.
#' @post /api/chemical-properties
function(metabolites="", property="all") {
    properties <- property
    if (!is.null(property)) {
        properties <- c(property)
    }
    chemical_properties_df <- tryCatch({
        analytes_df <- RaMP::getChemicalProperties(
                                 db = rampDB,
                                 metabolites,
                                 propertyList = properties
                             )$chem_props
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(
        list(
            data = chemical_properties_df,
            function_call = makeFunctionCall(metabolites,"getChemicalProperties"),
            numFoundIds = length(unique(chemical_properties_df$chem_source_id))
        )
    )
}

#####
#' Perform chemical enrichment on given metabolites
#' @param metabolites Input for chemical enrichment
#' @param background Restrict background to particular biospecimen
#' @param backgroundFile: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-class-enrichment
function(metabolites = '', backgroundFile = '', background = '', backgroundType = "database") {
  chemical_enrichment_df <- ''
  if(backgroundFile == "") {
    if(background == "") {
      print("run with database background")
      chemical_enrichment_df <- RaMP::runEnrichChemClass(
        db = rampDB,
        metabolites,
        background = NULL,
        backgroundType= "database"
      )
    } else {
      print("run with biospecimen")
      chemical_enrichment_df <- RaMP::runEnrichChemClass(
        db = rampDB,
        metabolites,
        background = background,
        backgroundType= "biospecimen"
      )
    }
  }
  else {
    print("run with background file")
    bg <- gsub("\r\n", ",", backgroundFile)
    background <- unlist(strsplit(bg, ','))
    if(length(background) > length(metabolites)) {
      chemical_enrichment_df <- RaMP::runEnrichChemClass(
        db = rampDB,
        metabolites,
        background = background,
        backgroundType= "list"
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
    }
  }
    return(
      list(
        data = chemical_enrichment_df,
        function_call = makeFunctionCall(metabolites,"runEnrichChemClass")
      )
    )
  }


#####
#' Perform reaction class enrichment on given analytes
#' @param inputFiles: [File]
#' @param manifestFile: File
#' @parser multi
#' @parser text
#' @parser csv
#' @parser json
#' @post /api/metlinkr
function(inputFiles = '', manifestFile) {
#  mp <- mime::parse_multipart(req)
 # readr::read_csv(mp$file$datapath)
  manifest_df <- read.csv(manifestFile, header="T")
  print(manifest_df)
  input_df <- read.csv(inputFiles, header="T")
print(input_df)
  n_cores <- parallel::detectCores() - 1
#  metLinkR_output <- harmonizeInputSheets(inputcsv= path,
#                                          n_cores = n_cores,
#                                          mapping_library_format="both",
#                                          remove_parentheses_for_synonym_search = TRUE,
#                                          use_metabolon_parsers = TRUE,
#                                          majority_vote = TRUE)
#      print(metLinkR_output)
#  unlink(names[manifestFile])


 # return(
 #   metLinkR_output
 # )
}





