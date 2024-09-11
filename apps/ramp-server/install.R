library(devtools)

# install dependency BiocManager
if (!require("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
BiocManager::install("BiocFileCache", ask=FALSE)
install_github("ncats/RaMP-DB", force = TRUE, dependencies=TRUE)

library(RaMP)

rampDB <<- RaMP:::RaMP() # pre-load sqlite database to the container
