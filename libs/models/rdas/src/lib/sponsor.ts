import { gql } from "apollo-angular";

export class Sponsor {
  centralContactEMail?: string[]; //~50k
  centralContactName?: string[]; //~50k
  centralContactPhone?: string[]; //<50k
  centralContactPhoneExt?: string[]; // <50k
  centralContactRole?: string[]; //~50k
  leadSponsorClass?: string;
  leadSponsorName?: string;
  orgClass?: string;
  orgFullName?: string;
  orgStudyId?: string;
  orgStudyIdLink?: string;   //~1200
  orgStudyIdType?: string; //~1200
  OverallOfficialAffiliation?: string[]; //~140k
  OverallOfficialName?: string[]; //~140k
  OverallOfficialRole?: string[]; //~140k
  PointOfContactEMail?: string;
  PointOfContactOrganization?: string;
  PointOfContactPhone?: string;
  PointOfContactPhoneExt?: string;
  PointOfContactTitle?: string;
  ResponsiblePartyInvestigatorAffiliation?: string;
  ResponsiblePartyInvestigatorFullName?: string;
  ResponsiblePartyInvestigatorTitle?: string;
  ResponsiblePartyOldNameTitle?: string;
  ResponsiblePartyOldOrganization?: string;
  ResponsiblePartyType?: string;
}





const SPONSORFIELDS = gql`
  fragment sponsorFields on Sponsor {
    centralContactEMail: CentralContactEMail
    centralContactName:CentralContactName
    centralContactRole:CentralContactRole
    leadSponsorClass: LeadSponsorClass
    leadSponsorName: LeadSponsorName
    OrgClass
    OrgFullName
    OrgStudyId
    OrgStudyIdLink
    OrgStudyIdType
    OverallOfficialAffiliation
    OverallOfficialName
    OverallOfficialRole
    PointOfContactEMail
    PointOfContactOrganization
    PointOfContactPhone
    PointOfContactPhoneExt
    PointOfContactTitle
    ResponsiblePartyInvestigatorAffiliation
    ResponsiblePartyInvestigatorFullName
    ResponsiblePartyInvestigatorTitle
    ResponsiblePartyOldNameTitle
    ResponsiblePartyOldOrganization
    ResponsiblePartyType
  }
`;
