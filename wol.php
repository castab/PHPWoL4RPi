<!DOCTYPE html>
<html>
<title>W3.CSS</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<body class="w3-content" style="max-width:600px">

<div class="w3-container w3-border">

        <div class="w3-container w3-card w3-blue-grey w3-margin-top">
        <h1>Wake On Lan Utility</h1>
        </div>

        <h6>Select the computer(s) you would like to wake:</h6>
        <form class="w3-container w3-section"
        action="/wol_action.php" method="post">
        <input class="w3-check" type="checkbox" name="list[]" value="1">
        <label>PC 1</label>

        <input class="w3-check" type="checkbox" name="list[]" value="2">
        <label>PC 2</label>

        <input class="w3-check" type="checkbox" name="list[]" value="3">
        <label>PC 3</label>

        <button class="w3-button w3-ripple 
        w3-margin-top w3-dark-grey w3-block">Submit</button>
        </form>


        <div class="w3-container w3-blue-grey w3-margin-bottom">
        <h5>Feb, 2018</h5>
        <p class="w3-small">Written by Brayan Castaneda</p>
        <p class="w3-small">w3.CSS Powered</p>
        </div>
</div>
</body>
</html>
