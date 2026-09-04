Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\hero-mobile-ref.jpg"
$destPath = "c:\Users\Tech Store\OneDrive\Desktop\webcompany\assets\daniel-3d-mobile-sculpture.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$cropRect = New-Object System.Drawing.Rectangle(150, 500, 422, 380)

$cropBmp = New-Object System.Drawing.Bitmap(422, 380, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($cropBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$destRect = New-Object System.Drawing.Rectangle(0, 0, 422, 380)
$g.DrawImage($src, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

for ($y = 0; $y -lt 380; $y++) {
    for ($x = 0; $x -lt 422; $x++) {
        $p = $cropBmp.GetPixel($x, $y)
        
        $alphaLeft = 1.0
        if ($x -lt 70) {
            $alphaLeft = [Math]::Pow($x / 70.0, 1.8)
        }
        
        $alphaTop = 1.0
        if ($y -lt 40) {
            $alphaTop = [Math]::Pow($y / 40.0, 1.8)
        }
        
        $alphaRight = 1.0
        if ($x -gt 370) {
            $alphaRight = [Math]::Pow((422.0 - $x) / 52.0, 1.8)
        }
        
        $alphaBot = 1.0
        if ($y -gt 350) {
            $alphaBot = [Math]::Pow((380.0 - $y) / 30.0, 1.8)
        }
        
        # Zero out the upper-left text area completely
        $cornerFade = 1.0
        if ($x -lt 170 -and $y -lt 135) {
            # Ribbon starts around x=155 at y=130 and x=175 at y=70
            $ribbonDist = [Math]::Max(0.0, $x - 145.0 + ($y * 0.1))
            $cornerFade = [Math]::Min(1.0, [Math]::Pow($ribbonDist / 25.0, 2.0))
        }
        
        $a = [Math]::Min(1.0, [Math]::Max(0.0, ($alphaLeft * $alphaTop * $alphaRight * $alphaBot * $cornerFade)))
        $alphaByte = [int]($a * 255)
        
        $cropBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alphaByte, $p.R, $p.G, $p.B))
    }
}

$cropBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$cropBmp.Dispose()
$src.Dispose()
Write-Host "Pristine sculpture saved with clean alpha to $destPath"
