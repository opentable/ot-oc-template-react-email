const viewTemplate = `function(model){
  return model.__html ? model.__html : '';
}`;

module.exports = viewTemplate;
