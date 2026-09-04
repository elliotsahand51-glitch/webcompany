Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\hero-mobile-ref.jpg"
$destPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\hero-mobile-backdrop.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($src, 0, 0, $width, $height)

# Create an inpaint overlay bitmap
$overlay = New-Object System.Drawing.Bitmap($width, $height)
$gOver = [System.Drawing.Graphics]::FromImage($overlay)

# Vertical linear gradient matching exact sky lighting
$ptTop = New-Object System.Drawing.Point(0, 0)
$ptBot = New-Object System.Drawing.Point(0, 610)
$colTop = [System.Drawing.Color]::FromArgb(14, 26, 50)
$colMid = [System.Drawing.Color]::FromArgb(44, 74, 128)
$colSkyline = [System.Drawing.Color]::FromArgb(90, 122, 176)

$blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
$blend.Colors = @($colTop, $colMid, $colSkyline)
$blend.Positions = @(0.0, 0.58, 1.0)

$skyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($ptTop, $ptBot, $colTop, $colSkyline)
$skyBrush.InterpolationColors = $blend

# Fill up to y=615, x=450
$skyRect = New-Object System.Drawing.Rectangle(0, 0, 450, 615)
$gOver.FillRectangle($skyBrush, $skyRect)
$skyBrush.Dispose()

# Radial ambient window light curve
$pathGrad = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathGrad.AddEllipse(120, 100, 380, 520)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($pathGrad)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(55, 115, 160, 225)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 14, 26, 50))
$gOver.FillPath($glowBrush, $pathGrad)
$glowBrush.Dispose()
$pathGrad.Dispose()

# Blend overlay into $bmp:
# On the right:
# Above y=530: fade from x=410 to 450
# Below y=530 (near sculpture ribbon): fade from x=330 to 370 so sculpture is not touched
for ($y = 0; $y -lt 615; $y++) {
    for ($x = 0; $x -lt 450; $x++) {
        $maxX = 450.0
        $fadeStartX = 410.0
        
        # When y > 530, sculpture starts around x=370
        if ($y -gt 520) {
            $maxX = 370.0
            $fadeStartX = 330.0
        }
        
        $alphaX = 1.0
        if ($x -gt $fadeStartX) {
            $alphaX = [Math]::Max(0.0, ($maxX - $x) / ($maxX - $fadeStartX))
        }
        
        $alphaY = 1.0
        if ($y -gt 590) {
            $alphaY = [Math]::Max(0.0, (615.0 - $y) / 25.0)
        }
        
        $w = $alphaX * $alphaY
        $w = $w * $w * (3.0 - 2.0 * $w)
        
        if ($w -gt 0) {
            $orig = $src.GetPixel($x, $y)
            $ov = $overlay.GetPixel($x, $y)
            $r = [int]($orig.R * (1.0 - $w) + $ov.R * $w)
            $gCol = [int]($orig.G * (1.0 - $w) + $ov.G * $w)
            $b = [int]($orig.B * (1.0 - $w) + $ov.B * $w)
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
        }
    }
}

# Clean top right corner / hamburger area (x=465..560, y=10..65):
for ($y = 10; $y -le 65; $y++) {
    $cHamLeft = $src.GetPixel(455, $y)
    $cHamRight = $src.GetPixel(565, $y)
    for ($x = 460; $x -le 560; $x++) {
        $t = ($x - 460) / 100.0
        $r = [int]($cHamLeft.R * (1 - $t) + $cHamRight.R * $t)
        $gCol = [int]($cHamLeft.G * (1 - $t) + $cHamRight.G * $t)
        $b = [int]($cHamLeft.B * (1 - $t) + $cHamRight.B * $t)
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Clean right column neon pillar (x=465..565, y=340..460):
# The pillar has a smooth vertical gradient and neon beam at x=565
for ($y = 330; $y -le 465; $y++) {
    $cTop = $src.GetPixel(500, 325)
    $cBot = $src.GetPixel(500, 470)
    $tY = ($y - 330) / (465.0 - 330.0)
    for ($x = 465; $x -le 565; $x++) {
        $tX = ($x - 465) / 100.0
        # Blend vertically between y=325 and y=470
        $baseR = [int]($cTop.R * (1 - $tY) + $cBot.R * $tY)
        $baseG = [int]($cTop.G * (1 - $tY) + $cBot.G * $tY)
        $baseB = [int]($cTop.B * (1 - $tY) + $cBot.B * $tY)
        # Preserve the right neon edge intensity
        $edgeBoost = [Math]::Pow($tX, 4) * 45.0
        $r = [Math]::Min(255, [int]($baseR + $edgeBoost))
        $gCol = [Math]::Min(255, [int]($baseG + $edgeBoost))
        $b = [Math]::Min(255, [int]($baseB + $edgeBoost))
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Clean floor scroll indicator text (y=890..980, x=180..390):
# Inpainting from surrounding marble floor reflections
for ($y = 890; $y -le 980; $y++) {
    $cLeft = $src.GetPixel(175, $y)
    $cRight = $src.GetPixel(395, $y)
    for ($x = 180; $x -le 390; $x++) {
        $t = ($x - 180) / (390.0 - 180.0)
        # Marble reflection wave curve
        $wave = [Math]::Sin($t * [Math]::PI) * ($src.GetPixel($x, 880).B - $cLeft.B) * 0.4
        $r = [Math]::Min(255, [Math]::Max(0, [int]($cLeft.R * (1 - $t) + $cRight.R * $t + $wave * 0.4)))
        $gCol = [Math]::Min(255, [Math]::Max(0, [int]($cLeft.G * (1 - $t) + $cRight.G * $t + $wave * 0.6)))
        $b = [Math]::Min(255, [Math]::Max(0, [int]($cLeft.B * (1 - $t) + $cRight.B * $t + $wave)))
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Soft feathering blur along seam boundaries
$blurBmp = New-Object System.Drawing.Bitmap($bmp)
for ($y = 10; $y -le 610; $y++) {
    for ($x = 320; $x -le 460; $x++) {
        $totR = 0; $totG = 0; $totB = 0; $count = 0
        for ($dy = -2; $dy -le 2; $dy++) {
            for ($dx = -2; $dx -le 2; $dx++) {
                $ny = $y + $dy
                $nx = $x + $dx
                if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
                    $p = $blurBmp.GetPixel($nx, $ny)
                    $totR += $p.R; $totG += $p.G; $totB += $p.B; $count++
                }
            }
        }
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]($totR / $count), [int]($totG / $count), [int]($totB / $count)))
    }
}
$blurBmp.Dispose()

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$gOver.Dispose()
$overlay.Dispose()
$g.Dispose()
$bmp.Dispose()
$src.Dispose()
Write-Host "Pristine clean mobile backdrop successfully saved to $destPath"
