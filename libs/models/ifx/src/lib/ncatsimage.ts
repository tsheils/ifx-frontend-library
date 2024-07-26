export class NCATSImage {
  url!: string;
  caption!: string;

  constructor(obj: Partial<NCATSImage>) {
    if (obj.url) {
      this.url = obj.url;
    }
    if (obj.caption) {
      this.caption = obj.caption;
    }
  }
}
