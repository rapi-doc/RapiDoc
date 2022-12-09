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

export interface RapiDocTag extends OpenAPIV3.TagObject {
  show: boolean;
  elementId: string;
  name: string;
  description: string;
  headers: marked.Token[];
  expanded: boolean;
  firstPathId?: string;
  paths: {
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
    xBadges?: string;
    xCodeSamples: string;
  }[];
  'x-tag-expanded'?: boolean;
}

export interface RapiDocWebHookValue<T extends {} = {}>
  extends OpenAPIV3.PathItemObject<T> {
  _type: string;
}

interface RapiDocExtraOperation {
  'x-badges'?: string;
  'x-codeSamples'?: string;
  'x-code-samples'?: string;
}

export interface RapiDocPath<T extends {} = {}, P extends {} = {}>
  extends OpenAPIV3.PathsObject<T, {}> {
  [pattern: string]:
    | (RapiDocWebHookValue<T> & {
        [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject<
          T & RapiDocExtraOperation
        >;
      })
    | undefined;
}

export interface RapiDocDocument<T extends {} = {}>
  extends OpenAPIV3.Document<T> {
  servers?: RapiDocServer[];
  tags?: RapiDocTag[];
  paths: RapiDocPath<T, {}>;
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
  }[];
  webhooks?: {
    [index: string]: RapiDocWebHookValue & {
      [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject<T>;
    };
  };
}

export type RapiDocSecurityScheme = OpenAPIV3.SecuritySchemeObject & {
  securitySchemeId: string;
  typeDisplay?: string;
  oAuthFlow?: string;
  value?: string;
  finalKeyValue?: string;
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
