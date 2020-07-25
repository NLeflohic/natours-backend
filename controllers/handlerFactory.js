const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    //throw an error oif the id isn't in the objectId range => catch before
    if (!doc) {
      return next(new AppError('No doc found with this id', 404));
    }
    res.status(204).json({
      result: 'Success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }
    res.status(200).json({
      result: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: {
        document: newDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        document: doc,
      },
    });
  });

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //To allow nested GET reviews on tour
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };

    let query = Model.find(filter);
    if (populateOptions) query = query.populate(populateOptions);
    const features = new ApiFeatures(Model, query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });
