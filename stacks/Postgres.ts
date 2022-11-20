import ec2 = require("aws-cdk-lib/aws-ec2");
import rds = require("aws-cdk-lib/aws-rds");
import { StackContext, use } from "@serverless-stack/resources";
import { Port } from "aws-cdk-lib/aws-ec2";
import { Network } from "./Network";

const DB_CLUSTER_IDENTIFIER = process.env.DB_CLUSTER_IDENTIFIER;

export function Postgres({ stack }: StackContext) {
  const { vpc } = use(Network);

  const id = "Pg";

  // The security group that defines network level access to the cluster
  const securityGroup = new ec2.SecurityGroup(stack, `${id}-security-group`, {
    vpc: vpc,
  });

  const subnetGroup = new rds.SubnetGroup(stack, `${id}-subnet-group`, {
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    description: "Subnet for PostgresDB",
    vpc: vpc,
  });

  const connections = new ec2.Connections({
    securityGroups: [securityGroup],
    defaultPort: Port.tcp(5432),
  });

  let cluster;

  if (DB_CLUSTER_IDENTIFIER) {
    // import
    rds.DatabaseCluster.fromDatabaseClusterAttributes(stack, id, {
      clusterIdentifier: DB_CLUSTER_IDENTIFIER,
      securityGroups: [securityGroup],
    });
  } else {
    cluster = new rds.DatabaseCluster(stack, id, {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_4,
      }),
      // credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
      instanceProps: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.MICRO
        ),
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        vpc,
      },
    });
  }

  return { cluster };
}
