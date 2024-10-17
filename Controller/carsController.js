import car_Model from "../Model/Car.js";
export const addCar= async(req,res)=>{
    try {
        const { carbrand, rentrate, carmodel, year, enginetype } = req.body;
        if (![carbrand, rentrate, carmodel, year, enginetype].every(Boolean)) {
          return res.status(400).json( "Please provide all required fields." );
        }
        if(req.role!=="showroom"){
            return res.status(403).json("Unauthorized action. Only showroom owners can add cars.");
        }
        
        await car_Model.create({
            carbrand,
            rentrate,
            carmodel,
            year,
            enginetype,
            userId: req.user
        });
        console.log(req.body);
        console.log(req.file)
        console.log(req.user)
        return res.status(201).json("Car has been added successfully.");
    } catch (error) {
        console.error("Error adding car:", error); 
        return res.status(500).json("An internal server error occurred. Please try again later.");
    }
}


export const removeCar=async (req, res)=>{
    try {
        if (req.role !== 'showroom') {
            return res.status(403).json("Access denied. Only showroom owners can delete cars." );
        }
        const _id = req.params.id;
        console.log(_id);
        const car = await car_Model.findById(_id);
        if (!car) {
            return res.status(404).json("Car not found. Please try again." );
        }
        console.log({userID:car.userId})
        console.log({uid:req.user})
        if (req.user !== car.userId.toString()) {
            return res.status(403).json("Access denied. You can only delete cars you own." );
        }
        await car_Model.findByIdAndDelete(_id);
        
        return res.status(200).json("Car has been successfully deleted.");    
        
    } catch (error) {
        console.error("Error deleting car:", error);
        return res.status(500).json("An internal server error occurred. Please try again later." );
    }
}




export const searchCar = async (req, res) => {
    try {
        const { carModel, carBrand } = req.query;

        const query = {};
        if (carModel) {
            query.carmodel = { $regex: carModel, $options: 'i' };
        }
        if (carBrand) {
            query.carbrand = { $regex: carBrand, $options: 'i' }; 
        }
        const cars = await car_Model.find(query).populate('userId'); 

        if (cars.length === 0) {
            return res.status(404).json("No cars found matching your search criteria.");
        }


        return res.status(200).json(cars);
    } catch (error) {
        console.error("Error searching for cars:", error); 
        return res.status(500).json('Internal server error');
    }
};