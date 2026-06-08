// adding parts
const Parts = require('../models/Parts');
const { options } = require('../routes/serviceRouter');
exports.AddingParts = async (req, res) => {
    try {
        const {partName}=req.body;
        const existingParts=await Parts.findOne({partName});
        if(existingParts){
          return  res.status(400).json({
    error: "Part already exists",   // ✅ correct
            message: "this parts is already existing",
            success: false
            })
        }

        const value = await Parts.create(req.body);
        return res.status(200).json({
            message: "adding parts successfully",
            data: value,
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "something went wrong",
            success: false
        })
    }
}



// listing all parts


exports.ListingParts = async (req, res) => {
    try {
        const {
            search,
            maxPrice,
            minPrice,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page,
            limit

        } = req.query;
        let query = {};
        // searching
        if (search) {
            query.$or = [
                { partName: { $regex: search, $options: "i" } }
            ]

            if (!isNaN(search)) {
                query.$or.push({ stock: Number(search) });
                query.$or.push({ price: Number(search) });
            }
        }

        // filtering by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }


        // sorting apply
        const sortOptions = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        }

// pagination

 const NumberPage = Number(page) || 1;
const NumberLimit = Number(limit) || 10;
const skip=(NumberPage-1)*NumberLimit;
const totalRecords = await Parts.countDocuments(query);
        const fetchParts = await Parts.find(query).sort(sortOptions).skip(skip).limit(NumberLimit);
        return res.status(200).json({
            message: "fetching all parts successfully",
            data: fetchParts,
            success: true,
            pagination:{
                totalRecords,
                currentPage:NumberPage,
                totalPages:Math.ceil(totalRecords/NumberLimit),
               pageSize: NumberLimit,

            }
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "something went wrong",
            success: false
        })
    }
}



// update parts



exports.updateParts = async (req, res) => {
    try {
        const { id } = req.params;
        const updatePart = await Parts.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            message: "update  parts successfully",
            data: updatePart,
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "something went wrong",
            success: false
        })
    }
}



// delete parts



exports.deleteParts = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteparts = await Parts.findByIdAndDelete(id);
        return res.status(200).json({
            message: "delete  parts successfully",
            data: deleteparts,
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "something went wrong",
            success: false
        })
    }
}

