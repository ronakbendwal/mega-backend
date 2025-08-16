// const asyncHandler=(fun)=>{
//   async (req,res,next)=>{
//     try{

//       await fun(req,res,next);

//     }catch(error){

//       res.status(500 || error.code).json({
//         sucess:false,
//         message:`error occuse ${error}`
//       })

//     }
//   }}

//this code is also use but we have to go hard in backend and more conveninet method that i'll write below

const asyncHandler= (fun)=>{

return (req,res,next)=>
{
  res.resolve(fun(req,res,next))
  .catch((error)=>next(error)); 
}
}
//production grade code look like that 
export {asyncHandler};
