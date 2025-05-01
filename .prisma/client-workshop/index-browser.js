
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.VenueScalarFieldEnum = {
  venue_id: 'venue_id',
  venue_name: 'venue_name',
  venue_address: 'venue_address',
  venue_city: 'venue_city',
  venue_latitude: 'venue_latitude',
  venue_longitude: 'venue_longitude',
  venue_postcode: 'venue_postcode'
};

exports.Prisma.CategoryScalarFieldEnum = {
  category_id: 'category_id',
  category_name: 'category_name'
};

exports.Prisma.OrganizerScalarFieldEnum = {
  organizer_id: 'organizer_id',
  organizer_name: 'organizer_name',
  organizer_url: 'organizer_url'
};

exports.Prisma.LogoScalarFieldEnum = {
  logo_id: 'logo_id',
  logo_url: 'logo_url',
  logo_width: 'logo_width',
  logo_height: 'logo_height',
  logo_aspect_ratio: 'logo_aspect_ratio'
};

exports.Prisma.EventScalarFieldEnum = {
  event_id: 'event_id',
  event_name: 'event_name',
  event_description: 'event_description',
  start_datetime: 'start_datetime',
  end_datetime: 'end_datetime',
  event_summary: 'event_summary',
  category_id: 'category_id',
  organizer_id: 'organizer_id',
  venue_id: 'venue_id',
  logo_id: 'logo_id',
  event_status: 'event_status',
  event_url: 'event_url',
  is_free_event: 'is_free_event',
  community_friendly: 'community_friendly',
  predicted_community_friendly: 'predicted_community_friendly'
};

exports.Prisma.WebsiteScalarFieldEnum = {
  event_url: 'event_url',
  event_id: 'event_id'
};

exports.Prisma.ProviderScalarFieldEnum = {
  provider_id: 'provider_id',
  provider_name: 'provider_name',
  site_name: 'site_name',
  government_subsidised: 'government_subsidised',
  subsidy_tag: 'subsidy_tag',
  asqa_code: 'asqa_code',
  url: 'url',
  email: 'email'
};

exports.Prisma.LocationScalarFieldEnum = {
  geographic_id: 'geographic_id',
  provider_id: 'provider_id',
  address_line_1: 'address_line_1',
  suburb: 'suburb',
  postcode: 'postcode',
  latitude: 'latitude',
  longitude: 'longitude',
  full_address: 'full_address',
  region_name: 'region_name',
  local_government_authority: 'local_government_authority'
};

exports.Prisma.CourseScalarFieldEnum = {
  course_id: 'course_id',
  provider_id: 'provider_id',
  course_title: 'course_title',
  course_code: 'course_code',
  qualification_level: 'qualification_level',
  course_type: 'course_type',
  government_subsidised: 'government_subsidised',
  apprenticeship: 'apprenticeship',
  traineeship: 'traineeship',
  entry_requirements: 'entry_requirements',
  description: 'description',
  is_english_course: 'is_english_course'
};

exports.Prisma.LgaScalarFieldEnum = {
  lga_code: 'lga_code',
  lga_name: 'lga_name'
};

exports.Prisma.NationalityScalarFieldEnum = {
  nationality_id: 'nationality_id',
  nationality: 'nationality'
};

exports.Prisma.LgaNationalityScalarFieldEnum = {
  lga_nationality_id: 'lga_nationality_id',
  lga_code: 'lga_code',
  nationality_id: 'nationality_id',
  count: 'count'
};

exports.Prisma.CouncilInfoScalarFieldEnum = {
  lga_code: 'lga_code',
  council_name: 'council_name',
  council_info: 'council_info',
  address: 'address',
  suburb: 'suburb',
  postcode: 'postcode',
  phone: 'phone',
  email: 'email',
  website: 'website'
};

exports.Prisma.PostcodeScalarFieldEnum = {
  postcode: 'postcode',
  suburb: 'suburb',
  latitude: 'latitude',
  longitude: 'longitude',
  lga_code: 'lga_code'
};

exports.Prisma.LanguageScalarFieldEnum = {
  language_id: 'language_id',
  language: 'language'
};

exports.Prisma.LgaLanguageProficiencyScalarFieldEnum = {
  lga_language_prof_id: 'lga_language_prof_id',
  lga_code: 'lga_code',
  language_id: 'language_id',
  english_profiency_level: 'english_profiency_level',
  count: 'count'
};

exports.Prisma.LgaStatisticsScalarFieldEnum = {
  lga_code: 'lga_code',
  total_businesses: 'total_businesses',
  total_employed_over_15: 'total_employed_over_15',
  born_overseas: 'born_overseas',
  pct_arrived_within_5_years: 'pct_arrived_within_5_years',
  pct_proficient_english: 'pct_proficient_english',
  pct_speaks_other_lang_at_home: 'pct_speaks_other_lang_at_home',
  median_age_years: 'median_age_years',
  pct_completed_year_12: 'pct_completed_year_12',
  pct_certificate: 'pct_certificate',
  pct_bachelor_degree: 'pct_bachelor_degree',
  pct_postgraduate: 'pct_postgraduate',
  pct_managers: 'pct_managers',
  pct_professionals: 'pct_professionals',
  pct_labourers: 'pct_labourers'
};

exports.Prisma.LgaNationalityYearScalarFieldEnum = {
  lga_nationality_year_id: 'lga_nationality_year_id',
  lga_code: 'lga_code',
  nationality_id: 'nationality_id',
  year: 'year',
  count: 'count'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Venue: 'Venue',
  Category: 'Category',
  Organizer: 'Organizer',
  Logo: 'Logo',
  Event: 'Event',
  Website: 'Website',
  Provider: 'Provider',
  Location: 'Location',
  Course: 'Course',
  Lga: 'Lga',
  Nationality: 'Nationality',
  LgaNationality: 'LgaNationality',
  CouncilInfo: 'CouncilInfo',
  Postcode: 'Postcode',
  Language: 'Language',
  LgaLanguageProficiency: 'LgaLanguageProficiency',
  LgaStatistics: 'LgaStatistics',
  LgaNationalityYear: 'LgaNationalityYear'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
