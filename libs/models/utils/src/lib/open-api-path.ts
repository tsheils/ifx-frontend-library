export class OpenApiPath {
  description?: string;
  required?: string;
  title?: string;
  allowedTypes?: { metabolites: string[]; 'genes/proteins': string[] };
  tags: string[] = [];
  summary?: string;
  parent?: string;
  child?: string;
  properties: { [key: string]: unknown }[] = [];
  content: unknown;
  hideSection = false;

  constructor(obj: { [key: string]: any }) {
    Object.assign(this, obj['requestBody']);

    if (obj['summary']) {
      this.summary = <string>obj['summary'];
    }

    if (obj['parent']) {
      this.parent = <string>obj['parent'];
    }

    if (obj['child']) {
      this.child = <string>obj['child'];
    }

    if (obj['tags']) {
      this.tags = <string[]>obj['tags'];
    }

    if (obj['x-title']) {
      this.title = <string>obj['x-title'];
    }

    if (obj['x-hideSection']) {
      this.hideSection = <boolean>obj['x-hideSection'];
    }

    if (obj['x-allowedTypes']) {
      this.allowedTypes = <
        { metabolites: string[]; 'genes/proteins': string[] }
      >obj['x-allowedTypes'];
    }

    if (obj['requestBody'] && obj['requestBody']['content']) {
      let properties: { [key: string]: unknown } = {} as {
        [key: string]: unknown;
      };
      let examples: { [key: string]: unknown } = {} as {
        [key: string]: unknown;
      };
      if (obj['requestBody']['content']['application/json']) {
        properties =
          obj['requestBody']['content']['application/json']['schema'][
            'properties'
          ];
        examples =
          obj['requestBody']['content']['application/json']['schema'][
            'example'
          ];
      } else if (obj['requestBody']['content']['multipart/form-data']) {
        properties =
          obj['requestBody']['content']['multipart/form-data']['schema'][
            'properties'
          ];
        examples =
          obj['requestBody']['content']['multipart/form-data']['schema'][
            'example'
          ];
      }

      const exampleObj: { [key: string]: unknown } = {};
      if (examples) {
        Object.entries(examples).forEach(([key, value]) => {
          if (key != 'fishers_results') {
            exampleObj[key] = value;
          } else {
            if (value instanceof Object) {
              Object.keys(value as { [key: string]: unknown }).forEach(
                (key) => {
                  const val = value as { [key: string]: unknown };
                  if (!val['hidden']) {
                    exampleObj[key] = value[key as keyof typeof value];
                  }
                },
              );
            }
          }
        });
      }
      Object.entries(properties).forEach(([key, value]) => {
        const tempVal = value as { [key: string]: unknown };
        if (key != 'fishers_results' && !tempVal['hidden']) {
          this.properties.push({
            ...tempVal,
            field: key,
            parent: this.parent || '',
            value: exampleObj[key] ? exampleObj[key] : undefined,
          });
        }
      });
      delete this['content'];
    }
  }
}
