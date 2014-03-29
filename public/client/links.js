<div id='container'></div>
<button ng-click="x = 'createdAt'" class="date sort">Date</button>
<button ng-click="x = 'visits'" class="visit sort">Visits</button>
<button ng-click="reverse = true" class="ascending sort">^</button>
<button ng-click="reverse = false" class="descending sort">v</button>
<div class='info link' ng-repeat="link in links | orderBy:x:reverse">
<img src='/redirect_icon.png'/>
  <div class='visits'><span class='count'>{{link.visits}}</span>Visits</div>
  <div class='title'>{{link.title}}</div>
  <div class='original'>{{link.url}}</div>
  <a href='{{link.base_url}}/{{link.code}}'>{{link.base_url}}/{{link.code}}</a>
</div>