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
      # Synonyms
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
      # Synonyms
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
