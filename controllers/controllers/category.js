// MODEL || MIDLEWARE IMPORTS
const Category = require('../models/category');
const { errorHandler } =require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                message: 'Category does not exist'
            });
        }
        req.category = category
        next();
    });
}

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((error, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json({
            message: 'Category updated successfully',
            data
        })
    })
    
}

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((error, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json({
            message: 'Category deleted successfully',
            data
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json({
            message: 'Categories fetched successfully',
            data
        })
    })
}