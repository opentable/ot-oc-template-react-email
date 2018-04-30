const viewTemplate = ({
  reactRoot,
  externals,
  bundleHash,
  bundleName
}) => `function(model){
  var modelHTML =  model.__html ? model.__html : '';
  var staticPath = model.reactComponent.props._staticPath;
  var props = JSON.stringify(model.reactComponent.props);
  return modelHTML ? modelHTML : '<div id="${reactRoot}" class="${reactRoot}">' + modelHTML + '</div>' +
    '<script>' +
    'window.oc = window.oc || {};' +
    'oc.cmd = oc.cmd || [];' +
    'oc.cmd.push(function(oc){' +
      'oc.requireSeries(${JSON.stringify(externals)}, function(){' +
        'oc.require(' +
          '["oc", "reactComponents", "${bundleHash}"],' +
          '"' + staticPath + '${bundleName}.js",' +
          'function(ReactComponent){' +
            'var targetNode = document.getElementById("${reactRoot}");' +
            'targetNode.setAttribute("id","");' +
            'ReactDOM.render(React.createElement(ReactComponent,' +  props + '),targetNode);' +
          '}' +
        ');' +
      '});' +
    '});' +
  '</script>'
}`;

module.exports = viewTemplate;
