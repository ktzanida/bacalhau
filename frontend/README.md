## multi user mlflow experiment

goals:

* helix users existing a "helix" keycloak realm
* a new UI (and API) for creating "helix projects"
* a helix project corresponds to a collection of entities with one or more owner users and collaborator permissions, initially an mlflow experiment but also later could include a kubeflow namespace + notebook servers...
* keycloak-gatekeeper should be used to enforce access to the mlflow experiment

hmmm, looking at the mlflow API concept/url structure
* models aren't under a certain experiment
* lots of api calls don't reference an experiment, rather a run id
* s3 access is direct from client anyway, sooo...

a better model would be like Mathew suggested, an mlflow per project/namespace
and still the ability to give collaborators read/write access to (the URLs of) a project
and we can create a minio (or whatever) bucket per mlflow instance, no problem
(maybe we can scale down mlflow instances to zero - maybe using knative - when there's no load on them for some time, to avoid the many namespaces = much memory usage problem)

but fundamentally i don't think there should be a project (kf namespace) per user!

so... a helix project still makes sense, and a helix project has:
* a kubeflow namespace (profile)?
* an mlflow instance

... maybe various other components as we need them

so. where would we store the state for a helix project? can we avoid having our own db for as long as possible?

we can [create resources for a specific resource server in keycloak](https://www.keycloak.org/docs/latest/authorization_services/index.html#_resource_create)

you can also attach arbitrary key/value metadata against these, so that's useful for e.g. referencing mlflow instances and such

TODO:

1. set up a way to set up a keycloak server programatically, maybe the keycloak operator in testfaster?
2. write a go program to manage API CRUD for helix namespaces as keycloak resources
3. ditto assigning users as owners, contributors or viewers of helix projects
4. can keycloak-gatekeeper assign whole endpoints to a resource? and be reconfigured automatically?

hmm. keycloak-gatekeeper has died, there are some maintainers for a fork with docs:
https://github.com/gogatekeeper/gatekeeper/blob/master/docs/user-guide.md

and one without docs:
https://github.com/oneconcern/keycloak-gatekeeper

---
in any case, it seems that gatekeeper wouldn't actually dynamically read resources from keycloak and apply them to upstreams, rather, they are statically configured.
maybe using istio authz would be more dynamic? anyway, park that thought for now.
let's see if we can imagine the user flow.

[User managed access](https://www.keycloak.org/docs/latest/authorization_services/#_service_user_managed_access) basically allows us to delegate the entire user facing project collaboration flow to the keycloak UI.
The one wrinkle is that you can't change the owner of a resource, but this will do for now!

How to create a resource as a user..?
[Use the API](https://www.keycloak.org/docs/latest/authorization_services/#creating-user-managed-resources)


outstanding questions:

1. How to protect a backend API with keycloak authnz?
   With OIDC.
2. How can we extend resource protection to mlflow instances, with POST/PUT/DELETE restrictions?
   Translate keycloak permissions into istio authz policies?
   Seems like `jwksUri` goes some way to integrating istio and keycloak?
   [Here](https://blog.ramjee.uk/istio-api-security-with-keycloak-in-kubernetes/).
   External authorizer? [Here](https://istio.io/latest/docs/tasks/security/authorization/authz-custom/)
   Also: [istio with external authorizer using oauth2_proxy and keycloak](https://github.com/oauth2-proxy/oauth2-proxy/issues/862).
   [Istio OIDC config](https://homelab.blog/blog/devops/Istio-OIDC-Config/).
   Maybe it can be all done natively with OIDC, or worst case, write our own little istio external authz shim which maps istio mlflow urls onto keycloak permission checks.


right, i think we're ready to build the backend!

projects are resources in helix client in keycloak, owned by the user who created them
they can be allocated by the user in keycloak to collaborators (viewer, editor)
we can define a policy so that admins (users in group admin) can see all resources

listing is done server-side in keycloak so will automatically handle filtering based on who has permission
and handle pagination for us

and proxying/authz will happen _in helix_ (i.e. helix will act as a reverse proxy)
https://github.com/rusenask/k8s-portforward may help here!

## mlops frontend

```bash
yarn install
yarn develop
# in another window
yarn server
```

Now open `http://localhost:8080`

The server is running on `http://localhost:3000` and that is proxied from `http://localhost:8080/api`

You can control where the proxy forwards to from `config/webpack.dev.js`
