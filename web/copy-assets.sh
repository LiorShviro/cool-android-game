#!/bin/bash
SRC="../src/assets/png"
DST="public/assets"
mkdir -p $DST/characters $DST/stations $DST/backgrounds $DST/obstacles $DST/items
cp $SRC/characters/*.png $DST/characters/ 2>/dev/null || true
cp $SRC/stations/*.png $DST/stations/ 2>/dev/null || true
cp $SRC/backgrounds/*.png $DST/backgrounds/ 2>/dev/null || true
cp $SRC/obstacles/*.png $DST/obstacles/ 2>/dev/null || true
cp $SRC/items/*.png $DST/items/ 2>/dev/null || true
echo "Assets copied!"
