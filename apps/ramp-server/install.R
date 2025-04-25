library(devtools)

# install dependency BiocManager
if (!require("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
BiocManager::install("BiocFileCache", ask=FALSE)
install_github("ncats/RaMP-DB@ramp3.0", force = TRUE, dependencies=TRUE)

library(RaMP)
devtools::install_github("ncats/MetLinkR")
rampDB <<- RaMP:::RaMP(branch='ramp3.0') # pre-load sqlite database to the container
