import car_Model from "../Model/Car.js";
const addCar= async(req,res)=>{
    try {
        const {carbrand,rentrate,carmodel,year,enginetype}=req.body
        if(!carbrand||!rentrate||!carmodel||!year||!enginetype){
           return res.status(400).json("please enter all requirments")
        }
        await car_Model.create({
            carbrand:req.body.carbrand,
            rentrate:req.body.rentrate,
            carmodel:req.body.carmodel,
            year:req.body.year,
            enginetype:req.body.enginetype,
        })
        console.log(req.body.rentrate);
        console.log(req.file)
        return res.status(200).json("sucess")
    } catch (error) {
        return res.status(500).json('Interval server error')
    }
}
export default addCar

