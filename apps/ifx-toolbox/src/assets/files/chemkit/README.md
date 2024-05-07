# ChemKit
ChemKit is a Bridge interface between NCATS code and various cheminformatics libraries.  This will allow clients of NCATS code to be able to switch between different cheminformatics libraries without changing a single line of NCATS code.

## Chemkit API
The Chemkit-API module is the client api and contains all the classes and interfaces client code should use and directly access.  The root package for this api is `gov.nih.ncats.chemkit.api`.  If client code imports any classes outside of this package (or any child package), then the code is doing something wrong.

## Chemkit SPI
The Chemkit Service Provider Interface (SPI) contain the actual implementation classes that the different cheminformatics libraries submodules need to implement to properly interact with chemkit.  The root package for this api is `gov.nih.ncats.chemkit.spi`.  These classes should never be directly exposed to client code.

### SPI uses ServiceLoader
Chemkit makes heavy use of the `java.util.ServiceLoader` class to automatically register and locate SPI implementations.  This lets clients just include their SPI implementation module of choice in their classpath and chemkit will automatically pick it up.  (Currently only 1 module is supported at a time).

### Current SPI implementations:
The following chemkit spi submodules are included


#### chemkit-cdk
A CDK implementation to use with the open source CDK library.
#### chemkit-marvin
An Chemaxon's JChem implementation, clients must provide their own JChem dependency since
it's a commerical license. 
  
#### chemkit-jchem3
An striped down old version of Chemaxon's JChem 3 that is used internally at NCATS
and no where else.  This version is only used for NCATS legacy purposes and 
should not be used externally. implementation to use with  JChem library. 
    
    
# Other Chemkit Modules
Chemkit also comes with other modules that provide additional framework and algorithm support
but may only be used by a subset of client code so it is bundled as separate modules 
to allow clients the flexibility to depend on them or not.

## chemkit-apitest
Since chemkit mostly defers to other cheminformatics implementations most of the testing needed
to assert that the implementations are working are that the contracts of the interfaces are enforced correctly.  Therefore, most of the automated tests only test against the ChemKit api layer
all these tests are included in the `chemkit-apitest` module.  Implementation modules
can include these tests by adding the `dependenciesToScan` configuration to its surefire plugin:

    dependenciesToScan<plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.19.1</version>
        <configuration>
            <dependenciesToScan>
                <dependency>gov.nih.ncats:chemkit-apitest</dependency>
            </dependenciesToScan>
        </configuration>
      </plugin>
      
## chemkit-renderer
An NCATS designed renderer to draw images of Chemicals using Java Graphics to be used 
in Java GUI code or saved as images.
## chemkit-inchi
A wrapper around the Inchi C libraries to compute Inchis from Chemkit Chemicals.  This should 
not be used directly by clients and is intended only for SPI implementors whose
cheminformatics library does not already provide Inchi integration.  If possible it is recommended
that the cheminformatics library Inchi implementation be used instead.
 
# Using Chemkit in your Code
To use Chemkit in your code just include the chemkit-api and one of the spi submodules in your maven `pom`.

    <dependencies>
       <dependency>
         <groupId>gov.nih.ncats</groupId>
         <artifactId>chemkit-api</artifactId>
        <version>0.8</version>
       </dependency>
       <dependency>
         <groupId>gov.nih.ncats</groupId>
         <artifactId>chemkit-cdk</artifactId>
         <version>0.8</version>
       </dependency>
       <dependency>
         <groupId>gov.nih.ncats</groupId>
         <artifactId>chemkit-renderer</artifactId>
         <version>0.8</version>
       </dependency>
     </dependencies>
     
     
# Building Chemkit
 
 Chemkit uses Maven.  Since there are several modules that use libraries a user might not have licenses for or access to, it is recommended that you only build the modules that you need using maven's `-pl` option to list the modules to include in the build process. WARNING: make sure you have a recent version of maven, at least 3.5+ which introduced the -pl option.  Previous versions of mvn don't support only buildng some submodules.
 
     $ mvn clean install -pl 'chemkit-api, chemkit-apitest, chemkit-inchi, chemkit-renderer,chemkit-cdk'
 