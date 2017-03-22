provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_elastic_beanstalk_application" "stickies" {
  name = "stickies"
  description = "stickies dev server"
}

resource "aws_elastic_beanstalk_configuration_template" "stickies-config-template" {
  name                = "stickies-template-config"
  application         = "${aws_elastic_beanstalk_application.stickies.name}"
  solution_stack_name = "64bit Amazon Linux 2016.09 v4.0.0 running Node.js"
}

resource "aws_elastic_beanstalk_environment" "stickies-env" {
  name                = "stickies"
  application         = "${aws_elastic_beanstalk_application.stickies.name}"
  solution_stack_name = "64bit Amazon Linux 2016.09 v4.0.0 running Node.js"
}
