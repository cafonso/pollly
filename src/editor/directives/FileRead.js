var YAMLJS = require('js-yaml')

module.exports = window.angular.module('FileRead', []).directive('fileread', [
  'AlertManager',
  function (AlertManager) {
    return {
      link: function (scope, element, attributes) {
        element.bind('change', function (changeEvent) {
          var reader = new window.FileReader()
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              try {
                scope.fileread = YAMLJS.safeLoad(loadEvent.target.result)
              } catch (e) {
                if (e.reason === 'duplicated mapping key') {
                  AlertManager.add({
                    type: 'danger',
                    msg: 'Duplicate Key : ' + e.message
                  })
                } else {
                  AlertManager.add({
                    type: 'danger',
                    msg: 'Unknown error'
                  })
                }
                console.error('YAML Execption', e)
                return false
              }

              if (attributes.fileread === 'lhs') {
                document.querySelector('label.lhs').classList.add('disabled')
                document
                  .querySelector('input.lhs')
                  .setAttribute('disabled', 'disabled')
              } else {
                document.querySelector('label.rhs').classList.add('disabled')
                document
                  .querySelector('input.rhs')
                  .setAttribute('disabled', 'disabled')
              }
              scope.$emit('filereaded', {
                datas: scope.fileread,
                state: attributes.fileread,
                filename: changeEvent.target.files[0].name
              })
            })
          }
          reader.readAsText(changeEvent.target.files[0])
        })
      }
    }
  }
]).name
