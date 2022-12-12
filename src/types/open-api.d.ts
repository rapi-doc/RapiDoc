
declare module "@apitools/openapi-parser" {
  import { OpenAPIV3 } from 'openapi-types';
  const Spec: {
    resolvedSpec?: {
      jsonSchemaViewer: unknown;
      schemaAndExamples: any[];
      info: unknown;
    };
    spec: OpenAPIV3.Document;
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
