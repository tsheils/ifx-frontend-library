import { gql } from "apollo-angular";


export const TREEROOTPARAMETERS = {
  where: {
    subClassOfGardsAggregate: {
      count: 0
    },
    AND: [
      {
        DisorderType_NOT: "Disease"
      }
    ]
  }
};

export const DISEASEBRANCHPARAMETERS = {
  searchString: '',
  skip: 0,
  limit: 10
};

export const CATEGORYTREEBRANCH = gql`
  query Tree($where: GARDWhere) {
    diseases:gards(where: $where) {
        gardId:GardId
        name:GardName
        children:gardSsubClassOf {
            name: GardName,
            gardId: GardId
            ClassificationLevel
            DisorderType
          _childrenCount: gardSsubClassOfAggregate {
                count
            }
        }
    }
  }
`

export const CATEGORYTREE = gql`
  query Tree($where: GARDWhere) {
    diseases:gards(where: $where) {
        gardId:GardId
        name:GardName
      ClassificationLevel
      DisorderType
          _childrenCount: gardSsubClassOfAggregate {
                count
            }
        }
    }
`

export const FETCHPATH = gql`
  query Query($searchString: String) {
    treeBranch(searchString: $searchString)
  }
`
export const FETCHROOT = gql`
  query Query {
   diseases:treeParent
  }
`

export const FETCHPATHDISEASES = gql`
  query Query($searchString: String, $skip: Int, $limit: Int) {
    diseases:hierarchyDiseases (searchString: $searchString, limit: $limit, skip: $skip) {
      name:GardName
      gardId: GardId
      classificationLevel: ClassificationLevel
      disorderType: DisorderType
      synonyms: Synonyms
    }
    total:hierarchyDiseasesCount(searchString: $searchString, limit: $limit, skip: $skip)
  }
`




export const DISEASETYPEAHEAD = gql`
  query Gards($searchString: String) {
    diseaseSearch(searchString: $searchString) {
      name: GardName,
      gardId: GardId
    }
  }
`

export const FETCHDISEASESLISTQUERY = gql`
  query Gards($options: GARDOptions, $where: GARDWhere) {
    diseases: gards(options: $options, where: $where) {
      name:GardName
      gardId: GardId
      classificationLevel: ClassificationLevel
      disorderType: DisorderType
      synonyms: Synonyms
    }
    total: gardsAggregate(where: $where) {
      count
    }
  }
`

export const FETCHDISEASEQUERY = gql`
  query Gards($where: GARDWhere) {
    disease: gards(where: $where) {
      name:GardName
      gardId: GardId
      classificationLevel: ClassificationLevel
      disorderType: DisorderType
      synonyms: Synonyms
    }
    total: gardsAggregate(where: $where) {
      count
    }
  }
`




export const DISEASEQUERYPARAMETERS: {
  where?: { GardId?: null | string }
} = {
  where: { GardId: null }
}

export const LISTQUERYPARAMETERS: {
    options: {
      limit?: number,
      offset?: number,
      sort?: [{ [key: string]: string }],
    },
    where?: { [key: string]: string }
  } =
    {
      options: {
        limit: 10,
        offset: 0,
        sort: [
          {
            GardName: "ASC"
          }
        ]
      },
      where: {
        ClassificationLevel: "Disorder",
      }
    }
;
