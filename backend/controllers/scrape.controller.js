
//Store scraped applications in a model
exports.scrape = (req, res) => {
  console.log(req.body);
  res.json(req.body);
};
