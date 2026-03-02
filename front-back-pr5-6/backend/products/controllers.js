let service; 

const getAll = (req, res) => {
  res.json(service.getAll());
};

const getById = (req, res) => {
  try {
    res.json(service.getById(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const create = (req, res) => {
  try {
    const product = service.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = (req, res) => {
  try {
    res.json(service.update(req.params.id, req.body));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const remove = (req, res) => {
  try {
    service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  setService: (svc) => { service = svc; }
};