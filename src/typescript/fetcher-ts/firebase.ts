const login = (email: string, password: string) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => {
      // Handle success
      const { uid, email, refreshToken } = response.user!
      const { creationTime, lastSignInTime } = response.user?.metadata!
      return {
        uid,
        email,
        refreshToken,
        metadata: {
          creationTime,
          lastSignInTime,
        },
      }
    })
    .catch(error => {
      // Handle error
      console.error(error)
    })
