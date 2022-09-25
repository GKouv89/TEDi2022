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

# Εκκίνηση frontend
`$ cd frontend
$ npm start`
