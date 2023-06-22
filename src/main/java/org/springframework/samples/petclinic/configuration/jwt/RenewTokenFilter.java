package org.springframework.samples.petclinic.configuration.jwt;

import java.io.IOException;

import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.configuration.services.UserDetailsServiceImpl;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.plan.Plan;
import org.springframework.samples.petclinic.plan.ParserPlan;
import org.springframework.samples.petclinic.plan.PlanService;

import es.us.isagroup.FeatureTogglingUtil;

public class RenewTokenFilter extends OncePerRequestFilter {

	@Autowired
	private UserService userService;
	
	@Autowired
	private PlanService planService;

	@Autowired
	private JwtUtils jwtUtils;

	@Value("${petclinic.app.jwtSecret}")
	private String jwtSecret;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		try {
			String jwt = parseJwt(request);
			String newToken = null;
			if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
				Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();

				Object userAuthorities = new HashMap<>();

				if (!(userAuth.getPrincipal() instanceof String)) {
					UserDetailsImpl userDetails = (UserDetailsImpl) userAuth.getPrincipal();
					userAuthorities = userDetails.getAuthorities().stream().map(auth -> auth.getAuthority())
							.collect(Collectors.toList());
				}

				Map<String, Object> userContext = userService.findUserContext();
				Plan userPlan = userService.findUserPlan();
				ParserPlan planParser = planService.findPlanParserById(1);

				FeatureTogglingUtil util = new FeatureTogglingUtil(userPlan.parseToMap(),
						planParser.parseToMap(), userContext, jwtSecret, userAuthorities);
				
				newToken = util.generateUserToken();

				String newTokenFeatures = jwtUtils.getFeaturesFromJwtToken(newToken);
				String jwtFeatures = jwtUtils.getFeaturesFromJwtToken(jwt);

				System.out.println("New token features: " + newTokenFeatures);
				System.out.println("Old token features: " + jwtFeatures);

				if (!newTokenFeatures.equals(jwtFeatures)) {
					response.addHeader("New-Token", newToken);
				}
			}
		} catch (Exception e) {
			logger.info("Anonymous user logged");
		}

		filterChain.doFilter(request, response);
	}

	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");

		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7, headerAuth.length());
		}

		return null;
	}

}
