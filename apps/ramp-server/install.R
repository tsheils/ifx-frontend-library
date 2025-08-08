library(devtools)

# install dependency BiocManager
if (!require("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
BiocManager::install("BiocFileCache", ask=FALSE)
install_github("ncats/RaMP-DB", force = TRUE, dependencies=TRUE)

library(RaMP)
#install('workspace/metlinkR')
devtools::install_github("ncats/MetLinkR")
rampDB <<- RaMP:::RaMP() # pre-load sqlite database to the container
