export class UriBuilder {
  private uri = '';

  constructor() {
  }

  /**
   * Create a new instance representing a relative URI initialized from a URI path.
   * @param fullPath
   */
  public fromPath(fullPath: string): UriBuilder {
    this.uri = fullPath;
    return this;
  }

  /**
   * Append path to the existing path.
   * @param pathElement
   */
  public path(pathElement: string): UriBuilder {
    this.uri = this.appendPath(this.uri, pathElement);
    return this;
  }


  public build(): string {
    return this.uri;
  }

  /**
   * return <URL>/<PATH>
   */
  private appendPath(url: string, path: string): string {
    return [url, path].join('/');
  }
}
