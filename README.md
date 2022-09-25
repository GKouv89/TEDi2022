# TEDi2022

# Για το HTTPS
1. Εγκατάσταση mkcert
2. Αντιγραφή περιεχομοένων rootCA.pem που συμπεριλαμβάνεται εδώ (μένει να το ανεβάσουμε) στο δικό σας rootCA.pem (βρίσκετε το path τρέχοντας mkcert -CAROOT)
3. Τρέξτε ξανά mkcert -install
4. Το certificate/κλειδί είναι έγκυρο

# Εκκίνηση backend
`$ cd backend

$ python --noreload manage.py runserver_plus --cert-file ../cert.pem --key-file ../key.pem`

# Εκκίνηση frontend
`$ cd frontend

$ npm start`
