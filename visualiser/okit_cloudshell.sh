# git clone https://github.com/oracle/oci-designer-toolkit
git clone https://github.com/sofianemad/oci-designer-toolkit/
cd oci-designer-toolkit
git checkout nightly
export OKIT_DIR=~/okit
file="$OKIT_DIR/log/okit.log"
mkdir -p $(dirname $file) && touch "$file"
pip install python-magic --user
tenancy_id=$(curl -L -s 'http://169.254.169.254/opc/v1/instance/' | jq -r '.freeformTags."user-tenancy-ocid"')
python visualiser/okit_query.py -p $OCI_CLI_PROFILE -r $OCI_CLI_PROFILE -j okit.json -c $tenancy_id -t $tenancy_id -s