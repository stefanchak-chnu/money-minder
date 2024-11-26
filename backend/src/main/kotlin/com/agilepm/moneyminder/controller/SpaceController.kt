package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.request.SpaceRequest
import com.agilepm.moneyminder.model.response.SpaceResponse
import com.agilepm.moneyminder.service.SpaceService
import com.agilepm.moneyminder.service.UserService
import com.agilepm.moneyminder.util.SecurityUtil
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/spaces")
class SpaceController(private val spaceService: SpaceService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/current")
    fun getCurrentSpace(): SpaceResponse {
        return spaceService.getSpaceResponse(SecurityUtil.getCurrentUserSpaceId());
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/switch/{spaceId}")
    fun switchSpace(
        @PathVariable spaceId: UUID,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): SpaceResponse {
        return spaceService.switchSpace(SecurityUtil.getCurrentUserId(), spaceId, request, response);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    fun getSpaces(): List<SpaceResponse> {
        return spaceService.getSpaceResponses(SecurityUtil.getCurrentUserId());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createSpace(@RequestBody spaceRequest: SpaceRequest): SpaceResponse {
        return spaceService.createSpace(SecurityUtil.getCurrentUserId(), spaceRequest);
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{spaceId}")
    fun updateSpaceName(@PathVariable spaceId: UUID, newName: String) {
        spaceService.updateSpaceName(spaceId, newName);
    }
}