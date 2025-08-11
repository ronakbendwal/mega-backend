class ApiResponse{
  constructor(
    statusCode,
    data,
    message="success",// property that we take when api sent response
  ){
    this.statusCode /*property of ApiResponse class*/  = statusCode// overrite all the property in the ApiResponse class again

    this.message /*property of ApiResponse class*/  = message // overrite all the property in the ApiResponse class again

    this.data /*property of ApiResponse class*/ = data // overrite all the property in the ApiResponse class again

    this.success /*property of ApiResponse class*/  = statusCode < 400// overrite all the property in the ApiResponse class again
  }
}


export {ApiResponse};