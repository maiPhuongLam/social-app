class HttpResponse {
  constructor(
    private statusCode: number,
    private message: string,
    private data: any
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default HttpResponse;
