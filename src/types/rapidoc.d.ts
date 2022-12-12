import { OpenAPIV3 } from 'openapi-types';
import { marked } from 'marked';

export interface RapiDocTheme {
  bg1: string;
  bg2: string;
  bg3: string;
  blue: string;
  borderColor: string;
  brown: string;
  codeBg: string;
  codeBorderColor: string;
  codeFg: string;
  codeKeywordColor: string;
  codeOperatorColor: string;
  codePropertyColor: string;
  fg1: string;
  fg2: string;
  fg3: string;
  green: string;
  headerColor: string;
  headerColorBorder: string;
  headerColorDarker: string;
  headerColorInvert: string;
  hoverColor: string;
  inlineCodeFg: string;
  inputBg: string;
  lightBg: string;
  lightBlue: string;
  lightBorderColor: string;
  lightFg: string;
  lightGreen: string;
  lightOrange: string;
  lightPink: string;
  lightRed: string;
  lightYellow: string;
  navAccentColor: string;
  navAccentTextColor: string;
  navBgColor: string;
  navHoverBgColor: string;
  navHoverTextColor: string;
  navTextColor: string;
  orange: string;
  overlayBg: string;
  pink: string;
  placeHolder: string;
  primaryColor: string;
  primaryColorInvert: string;
  primaryColorTrans: string;
  purple: string;
  red: string;
  selectionBg: string;
  selectionFg: string;
  yellow: string;
}

export type RapiDocMethods =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options';

export interface RapidocElement {
  shadowRoot: ShadowRoot;
  requestUpdate: () => void;
  dispatchEvent: (event: CustomEvent) => void;
  layout: 'row' | 'column';
  monoFont: string;
  regularFont: string;
  navItemSpacing: 'relaxed' | 'compact';
  responseAreaHeight: string;
  fontSize: 'default' | 'large';
  allowSpecFileDownload: 'true' | 'false';
  allowAdvancedSearch: 'true' | 'false';
  allowSearch: 'true' | 'false';
  allowSpecFileLoad: 'true' | 'false';
  allowSpecUrlLoad: 'true' | 'false';
  infoDescriptionHeadingsInNavBar: 'true' | 'false';
  showInfo: 'true' | 'false';
  headingText: string;
  onFileLoadClick: () => void;
  onSearchChange: () => void;
  onShowSearchModalClicked: () => void;
  onSpecFileChange: () => void;
  onSpecUrlChange: () => void;
  renderStyle: string;
  specFile: string;
  specUrl: string;
  resolvedSpec: RapiDocDocument;
  schemaExpandLevel: number;
  schemaDescriptionExpanded: 'true' | 'false';
  allowSchemaDescriptionExpandToggle: 'true' | 'false';
  scrollToEventTarget: (
    event: MouseEvent,
    scrollNavItemToView: boolean
  ) => void;
  onSelectExample: (
    event: Event,
    jSchemaBody: {
      elementId: string;
      name: string;
      schema: RapiDocSchema;
      examples: RapiDocExamples;
      example: string;
      selectedExample: string;
      description: string;
    }
  ) => void;
  bgColor: string;
  headerColor: string;
  navAccentColor: string;
  navAccentTextColor: string;
  navBgColor: string;
  navHoverBgColor: string;
  navHoverTextColor: string;
  navTextColor: string;
  primaryColor: string;
  textColor: string;
  theme: 'dark' | 'light';
  showHeader: 'true' | 'false';
  cssClasses: string;
  pageDirection: 'rtl' | 'ltr';
  loading: boolean;
  loadFailed: boolean;
  handleHref: (event: MouseEvent) => void;
  advancedSearchMatches: {
    elementId: string;
    deprecated: boolean;
    method: string;
    path: string;
    summary: string;
  }[];
  matchPaths: string;
  onAdvancedSearch: (event: Event, value: number) => void;
  onOpenSearchDialog: (event: Event) => void;
  showAdvancedSearchDialog: boolean;
  fillRequestFieldsWithExample: 'true' | 'false';
  schemaStyle: 'tree' | 'table';
  defaultSchemaTab: 'schema' | 'example';
  schemaHideWriteOnly: 'default' | 'never';
  schemaHideReadOnly: 'default' | 'never';
  fetchCredentials: 'omit' | 'same-origin' | 'include';
  replaceHistoryState: (value: string) => void;
  updateRoute: 'true' | 'false';
  routePrefix: string;
  selectedServer: RapiDocServer;
  persistAuth: 'true' | 'false';
  oauthReceiver: string;
  allowAuthentication: 'true' | 'false';
  showSummaryWhenCollapsed: boolean;
  allowTry: 'true' | 'false';
  showCurlBeforeTry: 'true' | 'false';
  matchType: string;
  onClearSearch: (event: MouseEvent) => void;
  navActiveItemMarker: string;
  allowServerSelection: 'true' | 'false';
  onNavTagClick: 'show-description' | 'expand-collapse';
  usePathInNavBar: 'true' | 'false';
  showMethodInNavBar: 'as-colored-block';
  showComponents: 'true' | 'false';
  focusedElementId: string;
}

export interface DocumentModifiedByRapiDoc<T extends {} = {}>
  extends OpenAPIV3.Document {
  servers?: (OpenAPIV3.ServerObject & {
    computedUrl?: string;
    variables?: {
      [variable: string]: OpenAPIV3.ServerVariableObject & { value?: string };
    };
  })[];
  tags?: (OpenAPIV3.TagObject & { 'x-tag-expanded'?: boolean })[];
  webhooks?: Record<
    string,
    (OpenAPIV3.PathItemObject | OpenAPIV3.ReferenceObject) & {
      _type?: 'webhook';
    }
  >;

  paths: OpenAPIV3.PathsObject<
    T,
    {
      _type?: 'webhook';
    }
  >;
}

export interface RapiDocServer extends OpenAPIV3.ServerObject {
  computedUrl?: string;
  variables?: {
    [variable: string]: OpenAPIV3.ServerVariableObject & {
      default: string;
      value: string;
    };
  };
}

export interface RapiDocXCodeSample {
  lang: string;
  label: string;
  source: string;
}

export interface RapiDocTag {
  show: boolean;
  elementId: string;
  name: string;
  description: string;
  headers: (marked.Token & { depth?: number; text?: string })[];
  expanded: boolean;
  firstPathId?: string;
  paths: RapiDocPath[];
  'x-tag-expanded'?: boolean;
}

export type RapiDocOperationObject<T extends {} = {}> =
  OpenAPIV3.OperationObject<T> & {
    'x-badges'?: string;
    'x-codeSamples'?: string;
    'x-code-samples'?: string;
  };

export interface RapiDocWebHookValue<T extends {} = {}>
  extends OpenAPIV3.PathItemObject<T> {
  _type: string;
}

interface RapiDocExtraOperation {
  'x-badges'?: string;
  'x-codeSamples'?: string;
  'x-code-samples'?: string;
}

export interface RapiDocPath {
  show: boolean;
  expanded: boolean;
  isWebhook: boolean;
  expandedAtLeastOnce: boolean;
  summary: string;
  description: string;
  externalDocs?: OpenAPIV3.ExternalDocumentationObject;
  shortSummary: string;
  method: RapiDocMethods;
  path: string;
  operationId?: string;
  elementId: string;
  servers: OpenAPIV3.ServerObject[];
  parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[];
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
  responses?: OpenAPIV3.ResponsesObject;
  callbacks?: {
    [callback: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.CallbackObject;
  };
  deprecated?: boolean;
  security?: OpenAPIV3.SecurityRequirementObject[];
  xBadges?: { color: string; label: string }[];
  xCodeSamples: RapiDocXCodeSample[];
}

export interface RapiDocDocument {
  openapi: string;
  info: OpenAPIV3.InfoObject;
  security?: OpenAPIV3.SecurityRequirementObject[];
  externalDocs?: OpenAPIV3.ExternalDocumentationObject;
  'x-express-openapi-additional-middleware'?: (
    | ((request: any, response: any, next: any) => Promise<void>)
    | ((request: any, response: any, next: any) => void)
  )[];
  'x-express-openapi-validation-strict'?: boolean;

  servers?: RapiDocServer[];
  tags?: RapiDocTag[];
  paths: RapiDocPath[];
  isSpecLoading: boolean;
  specLoadError: boolean;
  schemaAndExamples: {
    elementId: string;
    name: string;
    schema: RapiDocSchema;
    examples: RapiDocExamples;
    example: string;
    selectedExample: string;
    description: string;
  }[] /* 
  webhooks?: {
    [index: string]: RapiDocWebHookValue & {
      [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject<T>;
    };
  }; */;
  securitySchemes: RapiDocSecurityScheme[];
  infoDescriptionHeaders: { text: string; depth: number }[];
  components: {
    show: boolean;
    name: string;
    description: string;
    // securitySchemes: RapiDocSecurityScheme[];
    subComponents: {
      show: boolean;
      id: string;
      name: string;
      component: any;
      expanded?: boolean;
    }[];
  }[];
}

export type RapiDocSecurityScheme = OpenAPIV3.SecuritySchemeObject & {
  securitySchemeId: string;
  typeDisplay?: string;
  oAuthFlow?: string;
  value?: string;
  finalKeyValue?: string;
  username?: string;
  user?: string;
  password?: string;
  'x-client-id'?: string;
  'x-client-secret'?: string;
  'x-default-scopes'?: string[];
  'x-receive-token-in'?: string;
};

export interface RapiDocExamples {
  [index: string]: { value: string; summary: string; description: string };
}

export type RapiDocSchema = OpenAPIV3.SchemaObject & {
  length?: number;
  const?: boolean | number | string;
  enum?: boolean;
  format?: string;
  examples?: any[];
  items?: RapiDocSchema;
  type?: 'boolean' | 'object' | 'number' | 'string' | 'integer' | string;
};

export interface RapidocObj {
  '::TITLE'?: string;
  '::DESCRIPTION'?: string;
  '::XML_TAG'?: string;
  '::XML_WRAP'?: string;

  [index: string]: RapidocObj | undefined | string;
}
