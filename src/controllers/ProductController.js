import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
   try {
       const products = await Product.find();
       res.json(products);
   } catch (e) {
       res.status(500).json({
           message: e.message,
       })
   }
};

export const addProduct = async (req, res) => {
    try{
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
        });
        await newProduct.save();

        res.json(newProduct);
    } catch (e) {
        res.status(400).json({
            message: e.message,
        })
    }
}


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (e) {
        res.status(404).json({
            message: e.message,
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.json(product);

    } catch (e) {
        res.status(404).json({
            message: "Product not found",
        })
    }
}


export const deleteProduct = async (req, res) => {
    try {
       const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
            })
        }

        res.json({
            message: "Product successfully deleted.",
        });
    } catch (e) {
        res.status(404).json({
            message: "Product not found.",
        })
    }
}

