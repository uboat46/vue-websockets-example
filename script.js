window.onload = function (){
  var app = new Vue({
    el: '#app',
    data: function () {
      return {
        wsocket: null,
        chart: null,
        xVal: 0,
        dataLenght: 10,
        xLabel: [],
        dps: []
      }
    },
    methods: {
      onMessage: function (e) {
        var vm = this;
        vm.dps.push({x: vm.xVal, y: e.data});
        vm.xLabel.push(`${vm.xVal}`)
        vm.xVal++;
        if(vm.dps.length >= vm.dataLenght) {
          vm.dps.shift();
          vm.xLabel.shift();
        }
        vm.chart.update();
      }
    },
    mounted: function () {
      var vm = this;
      var ctx = vm.$el.querySelector('#chartContainer').getContext('2d');;
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: vm.xLabel,
          datasets: [{
            label: "rate",
            data: vm.dps,
          }]
        },
        options:  {
          title: {
            display: true,
            text: 'Dynamic Data'
          }
        }
      })
      vm.wsocket = new WebSocket('ws://18.219.103.59:9090/WebSocket/websocketendpoint');
      vm.wsocket.onmessage = vm.onMessage;
    }
  })
}