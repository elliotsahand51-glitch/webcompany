Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\showroom-bg.jpg"
$destPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\showroom-clean.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($src, 0, 0, $width, $height)

# In the reference image (1024 x 576):
# Left side from x = 0 to x = 440 has:
# - Logo at top-left: x=30..150, y=15..55
# - Headline & pill: x=40..430, y=130..330
# - Subtitle: x=40..430, y=340..400
# - Buttons: x=40..340, y=410..470
# - Trusted strip: x=40..420, y=490..560
# - Top nav center: x=330..720, y=20..50
# - Top nav right button: x=880..990, y=20..60

# We can sample the pure background gradient vertically along the left:
# Background is an architectural gradient from pure soft ivory #FAF9F7 to subtle atmospheric blue/white:
# Top: ~ (250, 249, 247)
# Mid: ~ (246, 249, 255)
# Let's inspect pixel colors at safe spots
Write-Host "Image dimensions: $width x $height"

# Let's create a smooth linear/radial gradient brush to paint over the left side text smoothly blending into the showroom column at x = 435:
# Left column blend:
$rectLeft = New-Object System.Drawing.Rectangle(0, 0, 440, $height)
$colorLeft = [System.Drawing.Color]::FromArgb(250, 249, 247)
$colorColumn = [System.Drawing.Color]::FromArgb(240, 246, 255)

$brushLeft = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(440, 0)),
    $colorLeft,
    $colorColumn
)
$g.FillRectangle($brushLeft, $rectLeft)
$brushLeft.Dispose()

# Also blend smoothly the transition boundary from x=410 to x=460 using alpha gradient so the column edge is natural:
for ($x = 410; $x -le 460; $x++) {
    $ratio = ($x - 410) / 50.0
    $alpha = [int]((1.0 - $ratio) * 255)
    if ($alpha -gt 0) {
        $c = [System.Drawing.Color]::FromArgb($alpha, 240, 246, 255)
        $pen = New-Object System.Drawing.Pen($c, 1)
        $g.DrawLine($pen, $x, 0, $x, $height)
        $pen.Dispose()
    }
}

# Top navbar cleanup:
# Top nav spans from x=320 to x=990, y=0 to y=65:
# Notice at the top of the showroom, there is a smooth curved ceiling canopy with radial ambient blue light.
# From x=320 to x=720, y=0 to y=60:
$rectNavMid = New-Object System.Drawing.Rectangle(320, 0, 420, 60)
$navColorTop = [System.Drawing.Color]::FromArgb(242, 246, 255)
$navColorBot = [System.Drawing.Color]::FromArgb(232, 240, 255)
$brushNav = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(320, 0)),
    (New-Object System.Drawing.Point(320, 60)),
    $navColorTop,
    $navColorBot
)
$g.FillRectangle($brushNav, $rectNavMid)
$brushNav.Dispose()

# Soft edge for nav cleanup:
for ($y = 45; $y -le 65; $y++) {
    $ratio = ($y - 45) / 20.0
    $alpha = [int]((1.0 - $ratio) * 200)
    if ($alpha -gt 0) {
        $c = [System.Drawing.Color]::FromArgb($alpha, 232, 240, 255)
        $pen = New-Object System.Drawing.Pen($c, 1)
        $g.DrawLine($pen, 320, $y, 740, $y)
        $pen.Dispose()
    }
}

# Top right button cleanup: x=870..1010, y=10..65:
# Ceiling glow in that area:
$rectNavRight = New-Object System.Drawing.Rectangle(870, 0, 154, 65)
$brushNavRight = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(870, 0)),
    (New-Object System.Drawing.Point(870, 65)),
    [System.Drawing.Color]::FromArgb(230, 240, 255),
    [System.Drawing.Color]::FromArgb(215, 232, 255)
)
$g.FillRectangle($brushNavRight, $rectNavRight)
$brushNavRight.Dispose()

# Save cleaned backdrop
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$src.Dispose()
$bmp.Dispose()
$g.Dispose()

Write-Host "Created showroom-clean.jpg successfully!"
