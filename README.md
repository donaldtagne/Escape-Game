# Änderungen hochladen
1. Überprüfen ob man auf dem richtigen Branch ist (nicht main!)... Zum Ändern des branches `git checkout <branchname>` verwenden  
2. `git add .` - Alle Dateien zum Hochladen markieren  
3. `git commit -m "Nachricht"` - Die Änderungen eintragen  
4. (optional) `git log` - Überprüfen ob der commit richtig verfasst wurde  
5. `git push` - Dateien hochladen  

# Änderungen von Anderen herunterladen
1. `git status` - Überprüfen ob keine Änderungen lokal gemacht wurden... Wenn Änderungen lokal gemacht wurden a: `git reset --hard` um alle zu löschen oder b: `git stash` um Änderungen zu speichern  
2. `git pull origin main` - Dateien runterladen  
3. Bei merge conflict: Mich anschreiben!  
4. `git push` - Eigene branch updaten  