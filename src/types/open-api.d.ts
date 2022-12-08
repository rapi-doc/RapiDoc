
declare module "@apitools/openapi-parser" {
  import { RapiDocDocument } from '@rapidoc-types';
  
  const Spec: {
    resolvedSpec?: {
      jsonSchemaViewer: unknown;
      schemaAndExamples: any[];
      info: unknown;
    };
    spec: RapiDocDocument;
    response?: {
      url: string;
      status: string;
      statusText: string;
    };
  };

  const OpenAPIParser: {
    resolve(options: {
      url: string | any;
      allowMetaPatches: boolean;
    }): Promise<typeof Spec>;
  };
  export default OpenAPIParser;
}
