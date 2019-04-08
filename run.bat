
cd %~dp0
%~d0
if "%1"=="" goto :help
if %1==dev goto :startDev
if %1==test goto :test
if %1==prod goto :startProd
if %1==install goto :install

:install
cnpm install 
goto :end

rem --save-dev gulp gulp-minify-css gulp-concat gulp-changed gulp-uglify gulp-rename gulp-minify-html gulp-imagemin gulp-cache del gulp-connect  gulp-file-include  gulp-cache imagemin-pngquant optipng-bin
:startDev
gulp startDev
goto :end

:startProd
gulp startProd
goto :end

:test
gulp test
goto :end

:help
echo tools startDev
echo tools startProd
echo tools install
echo tools help
start CMD
:end 
