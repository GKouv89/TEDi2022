# TEDi2022

# Για το HTTPS
Εγκατάσταση mkcert
αντιγραφή rootCA.pem (μένει να το ανεβάσουμε)
αλλαγή περιεχομένων rootCA.pem file στον φάκελο mkcert -CAROOT
ξανά mkcert -install
τώρα εγκαταστάθηκε σωστά το authority και το certificate/κλειδί είναι έγκυρο

# Εκκίνηση backend
`$ cd backend
$ python --noreload manage.py runserver_plus --cert-file ../cert.pem --key-file ../key.pem`

ΠΡΟΣΟΧΗ: ΤΡΕΞΤΕ ΜΕ ΤΟ --noreload flag ΜΟΝΟ οταν έχετε τελειώσει με το debugging
αλλιώς δεν θα επαναφορτώνεται άμεσα ο server και θα θέλει επανεκκίνηση

# Εκκίνηση frontend
`$ cd frontend
$ npm start`
