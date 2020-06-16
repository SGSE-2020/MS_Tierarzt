set -m
    /entrypoint.sh couchbase-server &
    sleep 15
    # Setup initial cluster/ Initialize Node
    couchbase-cli cluster-init -c 127.0.0.1 --cluster-name vet-service --cluster-username admin --cluster-password admin1 --services data,index,query,fts --cluster-ramsize 256 --cluster-index-ramsize 256 --cluster-fts-ramsize 256 --index-storage-setting default
    # Setup Administrator username and password
    curl -v http://127.0.0.1:8091/settings/web -d port=8091 -d username=admin -d password=admin1
    sleep 15
    # Setup Bucket
    couchbase-cli bucket-create -c 127.0.0.1:8091 --username admin --password admin1  --bucket vetservice --bucket-type couchbase --bucket-ramsize 256
    sleep 15
    # Setup RBAC user using CLI
    couchbase-cli user-manage -c 127.0.0.1:8091 --username admin --password admin1 --set --rbac-username testuser --rbac-password testpw --rbac-name testname --roles bucket_full_access[*],bucket_admin[*] --auth-domain local
	cbq -u admin -p admin1 -s "CREATE PRIMARY INDEX \`vet-index\` ON \`vetservice\`"
	#cbq \CONNECT http://localhost:8093;
	#cbq --script="CREATE PRIMARY INDEX `vet-index` ON `vetservice`";
    fg 1