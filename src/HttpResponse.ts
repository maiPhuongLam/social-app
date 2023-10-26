class HttpResponse {
  constructor(
    private isSuccess: boolean,
    private statusCode: number,
    private message: string,
    private data: any
  ) {
    this.isSuccess = isSuccess;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default HttpResponse;
