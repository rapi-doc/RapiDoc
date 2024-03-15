import ApiRequest from '../components/api-request';
import ApiResponse from '../components/api-response';
import DialogBox from '../components/dialog-box';
import JsonTree from '../components/json-tree';
import SchemaTable from '../components/schema-table';
import SchemaTree from '../components/schema-tree';
import TagInput from '../components/tag-input';
import JsonSchemaViewer from '../json-schema-viewer';
import OauthReceiver from '../oauth-receiver';
import RapiDoc from '../rapidoc';
/**
 * @see https://lit.dev/docs/components/defining/#typescript-typings
 */
declare global {
  interface HTMLElementTagNameMap {
    'api-request': ApiRequest;
    'api-response': ApiResponse;
    'dialog-box': DialogBox;
    'json-tree': JsonTree;
    'schema-table': SchemaTable;
    'schema-tree': SchemaTree;
    'tag-input': TagInput;
    'json-schema-viewer': JsonSchemaViewer;
    'oauth-receiver': OauthReceiver;
    'rapi-doc': RapiDoc;
  }
}
