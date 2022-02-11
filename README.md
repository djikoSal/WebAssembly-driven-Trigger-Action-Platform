# Building & deploying
Building: `$ fastly compute build`
Deploying: `$ fastly compute deploy`

# Tick Tock
Inspired by https://github.com/monperrus/travis-metronome/

Unfortunately, the standard JS function `setTimeout` is not available on fastly - it does not recognize it.

As an alternative we could simply do a request to https://httpbin.org/delay/20