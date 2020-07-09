<!DOCTYPE HTML>
<meta charset="utf-8">
<html>
<head>

<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400italic,600italic,700italic,200,300,400,600,700,900">
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<script src="http://d3js.org/topojson.v1.min.js"></script>

<style>

body, h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1em;
  color: #333;
  font-weight: 400;
}

#content {
  margin: 5px;
  padding: 20px;
  width: 805px;
  border: 1px solid #ccc;
}

#map {
  margin: 10px 0px 0px 0px;
  padding: 0px;
}

h1, h2 {
  line-height: 1em;
  font-size: 1.75em;
  font-weight: 900;
  color: #000;
}

h2.year {
  margin: 10px 0px 0px 0px;
  font-size: 1.3em;
  font-weight: 700;
}

p {
  margin: 10px 0px 0px 0px;
}

.county {
  fill: #fff;
}

.states {
  fill: none;
  stroke: #fff;
  stroke-linejoin: round;
}

input {
  display: block;
  width: 200px;
  margin: 10px 0px 0px 0px;
}

#legend text {
  font-size: 0.9em;
  color: #333;
  font-weight: 400;
}

.tooltip {
  position: absolute;
  padding: 7px;
  font-size: 0.9em;
  pointer-events: none;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;

  -moz-box-shadow:    3px 3px 10px 0px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.25);
  box-shadow:         3px 3px 10px 0px rgba(0, 0, 0, 0.25);
}

.tooltip p {
  margin: 0;
  padding: 0;
}

.tooltip table {
  margin: 0;
  padding: 0;
  border-collapse: collapse;
}

.wide {
  width: 140px;
}

</style>

</head>

<body>

<div id="content">
	<h1>U.S. Daily Cigarette Smoking Rate, 1996-2012</h1>
	<h2 class="date"></h2>
	<div class="slider"></div>
	<div id="map"></div>
	<p>Source: Institute for Health Metrics and Evaluation.</p>
</div>

<script type="text/javascript" src="map.js"></script>

</body>
</html>