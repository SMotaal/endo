# Per-compartment endowment policies

- I simplified the policy usecase to always thread it through compartmentMap. This means no separate runtime policy. 
- location abbreviation is used as means to differentiate packages with the same name (to avoid a bundled package claiming it's request and getting request's policy). Location works in archive usecase too, because policy gets resolved and written into compartmentMap while the locations are still known. 
  - The distinction between app and runtime decisions is now as follows: app uses policy to manage what its dependencies can have access to and limit supply chain risks; user endows the app with globals and can still decide how much to give it, but doesn't decide about the access internal bits of the app get. 
  

- `graphPackage` in node-modules.js can build up the aas 

## globals

- Do we need to wrap/unwrap global functions in Endo? If so, what do I do with  `__isKnownScopeProxy__` ?



## packages and builtins

- `"fs.readFileSync": true` - if we want to selectively grant access to a subset of a builtin while maintaining there's only one cached reference to it, we need to do the attenuation very close to the module - would have to mess with the require and import?
  - maybe since we're already controling the input and providing attenuations at runtime, the policy could say `"fs": "fs-read-attenuation"` and that's an entry in modules? Gives more fine grained control, but looses the scalability of a default solution where attenuation happens by default
















# archive

----

- Do we need the aa keys in policy? Doesn't seem like they're providing value, but generating them requires a separate iteration before linking or waiting for linking to finish before figuring out which keys to read from policy, which in turn makes it very inconvenient to implement policy enforcement.
  - We need to defend against self-given names, so that a bundled dependency can't call itself request and get the real request's policies by accident. Endo would give them different suffixes in names, but that's not enough - human error is super easy and we don't know if a shift in how dependencies get deduplicated or arranged won't reorder the names thus swapping suffixes.
  - Currently the simplest way to key these would be on location. Much harder for the policymaker to get wrong. On the other hand that means the policy for Archive's runtime would necessarily run on a different set of keys because it doesn't preserve paths, which brings back the confusion possibility if duplicates exist.

----


## dependencies
- if we're going for TOFU, we can create a compartment map once and persist its configuration of dependencies. 
- Regardless of how it's done, the definitions of imports for each module, agregated to the compartment, would then be the policy. 
- I guess we don't want to strictly bind an import to a specific module/file in a compartment/package as it'd demand unnecessary attention when a benign refactoring happened.
- as long as we don't support dynamic import of previously unknown files, policy on who can import what can be enforced early - at link - therefore giving better results to the archive/bundle usecases

## globals 
in link.js `const compartment = new Compartment(globals, ...` is providing globals to each compartment. We could narrow down which globals are used by each compartment by creating a subset here based on a policy keyed by the informaction available as compartmentName

- What would be more efficient? A Proxy checking against policy on each access or a copy for each compartment? A copy seems more reasonable as the policy can be garbage-collected before runtime in that case.